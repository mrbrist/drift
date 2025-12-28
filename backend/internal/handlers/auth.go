package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/mrbrist/drift/backend/internal/database"
	"github.com/mrbrist/drift/backend/internal/utils"
)

func (cfg *APIConfig) LoginHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	// parse the GoogleJWT that was POSTed from the front-end
	type parameters struct {
		GoogleJWT *string
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't decode parameters", err)
		return
	}

	// Validate the JWT is valid
	claims, err := utils.ValidateGoogleJWT(*params.GoogleJWT, cfg.Env.GoogleClientID)
	if err != nil {
		utils.RespondWithError(w, 403, "Invalid google auth", err)
		return
	}

	// if claims.Email != user.Email {
	// 	respondWithError(w, 403, "Emails don't match")
	// 	return
	// }

	user, err := cfg.DB.CreateUser(context.Background(), database.CreateUserParams{
		Firstname: claims.FirstName,
		Lastname:  claims.LastName,
		Email:     claims.Email,
	})
	if err != nil {
		utils.RespondWithError(w, 403, "Could not create user", err)
		return
	}

	fmt.Println(user)

	// create a JWT for OUR app and give it back to the client for future requests
	tokenString, err := utils.MakeJWT(claims.Email, cfg.Env.JWTSecret)
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't make authentication token", err)
		return
	}

	utils.RespondWithJSON(w, 200, struct {
		Token string `json:"token"`
	}{
		Token: tokenString,
	})

}
