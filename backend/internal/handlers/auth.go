package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/mrbrist/drift/backend/internal/utils"
)

type Login struct {
	HashedPassword string
	SessionToken   string
	CSRFToken      string
}

var users = map[string]Login{}

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")

	if len(username) < 2 || len(password) < 2 {
		err := http.StatusNotAcceptable
		http.Error(w, "Invalid username/password", err)
		return
	}

	// TODO: SWAP FOR DB
	if _, ok := users[username]; ok {
		err := http.StatusConflict
		http.Error(w, "User already exists", err)
		return
	}

	hashedPassword, _ := utils.HashPassword(password)

	// TODO: SWAP FOR DB
	users[username] = Login{
		HashedPassword: hashedPassword,
	}

	fmt.Fprintln(w, "User registered successfully")
}

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")

	// TODO: SWAP FOR DB
	user, ok := users[username]
	if !ok || !utils.CheckPasswordHash(password, user.HashedPassword) {
		err := http.StatusUnauthorized
		http.Error(w, "Invalid username/password", err)
		return
	}

	sessionToken := utils.GenerateToken(32)

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	// TODO: SWAP FOR DB
	user.SessionToken = sessionToken
	users[username] = user

	fmt.Fprintln(w, "Login successful")
}

func HandleLogout(w http.ResponseWriter, r *http.Request) {

}

func HandleProtected(w http.ResponseWriter, r *http.Request) {

}
