package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/mrbrist/drift/backend/internal/database"
	"github.com/mrbrist/drift/backend/internal/utils"
)

type contextKey string

const userContextKey contextKey = "user"

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

	user, err := cfg.DB.CreateUser(r.Context(), database.CreateUserParams{
		Firstname: claims.FirstName,
		Lastname:  claims.LastName,
		Email:     claims.Email,
	})
	if err != nil {
		utils.RespondWithError(w, 403, "Could not create user", err)
		return
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
		Secure:   true,                  // true in production with HTTPS
		SameSite: http.SameSiteNoneMode, // cross-origin
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
		Secure:   true,                  // true in production with HTTPS
		SameSite: http.SameSiteNoneMode, // cross-origin
		MaxAge:   1,
	})

	utils.RespondWithJSON(w, 200, "LOGGED OUT")
}

func (cfg *APIConfig) AuthMiddleware(next http.Handler) http.Handler {
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

func (cfg *APIConfig) ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(200)
}
