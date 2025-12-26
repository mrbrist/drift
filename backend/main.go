package main

import (
	"log"
	"net/http"

	"github.com/mrbrist/drift/backend/internal/handlers"
	"github.com/mrbrist/drift/backend/internal/utils"
)

type apiConfig struct {
	env *utils.EnvCfg
}

func main() {
	envCfg := utils.SetupEnvCfg()

	cfg := apiConfig{
		env: envCfg,
	}

	mux := http.NewServeMux()

	// HANDLERS HERE
	mux.HandleFunc("POST /register", handlers.HandleRegister)
	mux.HandleFunc("POST /login", handlers.HandleLogin)
	mux.HandleFunc("POST /logout", handlers.HandleLogout)
	mux.HandleFunc("GET /protected", handlers.HandleProtected)

	srv := &http.Server{
		Addr:    ":" + cfg.env.Port,
		Handler: mux,
	}

	log.Printf("Serving on: http://localhost:%s/app/\n", cfg.env.Port)
	log.Fatal(srv.ListenAndServe())
}
