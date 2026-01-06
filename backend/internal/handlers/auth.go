package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/mrbrist/drift/backend/internal/database"
	"github.com/mrbrist/drift/backend/internal/utils"
)

type contextKey string

const userContextKey contextKey = "user"
const boardIdContextKey contextKey = "board_id"

func UserIDFromContext(ctx context.Context) (uuid.UUID, bool) {
	user, ok := ctx.Value(userContextKey).(database.User)
	return user.ID, ok
}

func (cfg *APIConfig) LoginHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	type parameters struct{ GoogleJWT *string }
	var params parameters
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		utils.RespondWithError(w, 500, "Couldn't decode parameters", err)
		return
	}

	claims, err := utils.ValidateGoogleJWT(*params.GoogleJWT, cfg.Env.GoogleClientID)
	if err != nil {
		utils.RespondWithError(w, 403, "Invalid google auth", err)
		return
	}

	user_exists, err := cfg.DB.UserExistsByEmail(context.Background(), claims.Email)
	if err != nil {
		utils.RespondWithError(w, 500, "Could not check if user exists", err)
		return
	}

	var user database.User
	// Check if user exists and if the dont make a new one if they do return the existing one
	if user_exists {
		already_user, err := cfg.DB.GetUserByEmail(context.Background(), claims.Email)
		if err != nil {
			utils.RespondWithError(w, 500, "Could not find user", err)
			return
		}

		user = already_user
	} else {
		new_user, err := cfg.DB.CreateUser(r.Context(), database.CreateUserParams{
			Firstname: claims.FirstName,
			Lastname:  claims.LastName,
			Email:     claims.Email,
		})
		if err != nil {
			utils.RespondWithError(w, 403, "Could not create user", err)
			return
		}

		user = new_user
	}

	// Make app JWT
	tokenString, err := utils.MakeJWT(claims.Email, cfg.Env.JWTSecret)
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't make authentication token", err)
		return
	}

	// Set HttpOnly cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    tokenString,
		Path:     "/",
		HttpOnly: true,
		Secure:   cfg.Env.IsProd,
		SameSite: cfg.Env.HTTPSameSite,
		MaxAge:   7 * 24 * 60 * 60,
	})

	utils.RespondWithJSON(w, 200, user)
}

func (cfg *APIConfig) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	// Reset cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   cfg.Env.IsProd,
		SameSite: cfg.Env.HTTPSameSite,
		MaxAge:   1,
	})

	utils.RespondWithJSON(w, 200, "LOGGED OUT")
}

func (cfg *APIConfig) ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(200)
}

/*
	AUTH MIDDLEWARE
*/

func (cfg *APIConfig) RequireLoggedIn(next http.Handler) http.Handler {
	// Make sure the user is logged in
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("auth_token")
		if err != nil {
			utils.RespondWithError(w, 401, "Missing auth token", err)
			return
		}

		email, err := utils.ValidateJWT(cookie.Value, cfg.Env.JWTSecret)
		if err != nil {
			utils.RespondWithError(w, 401, "Invalid or expired token", err)
			return
		}

		user, err := cfg.DB.GetUserByEmail(r.Context(), email)
		if err != nil {
			utils.RespondWithError(w, 401, "User not found", err)
			return
		}

		ctx := context.WithValue(r.Context(), userContextKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (cfg *APIConfig) RequireBoardAccess(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID, ok := UserIDFromContext(r.Context())
		if !ok {
			utils.RespondWithError(w, http.StatusUnauthorized, "Unauthorized", nil)
			return
		}

		id := r.URL.Query().Get("board_id")
		board_id, err := uuid.Parse(id)
		if err != nil {
			utils.RespondWithError(w, 500, "You need to specify a board id", err)
			return
		}

		isOwner, err := cfg.DB.IsBoardOwner(r.Context(), database.IsBoardOwnerParams{
			ID:     board_id,
			UserID: userID,
		})
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Authorization failed", err)
			return
		}

		if !isOwner {
			utils.RespondWithError(w, http.StatusForbidden, "You do not own this board", nil)
			return
		}

		ctx := context.WithValue(r.Context(), boardIdContextKey, board_id)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
