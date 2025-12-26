package handlers

import (
	"fmt"
	"net/http"
)

func Register(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")

	fmt.Println(username, password)
}

func Login(w http.ResponseWriter, r *http.Request) {

}

func Logout(w http.ResponseWriter, r *http.Request) {

}

func Protected(w http.ResponseWriter, r *http.Request) {

}
