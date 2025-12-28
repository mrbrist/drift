package main

import (
	"log"
	"net/http"

	"github.com/mrbrist/drift/backend/internal/handlers"
	"github.com/mrbrist/drift/backend/internal/middleware"
	"github.com/mrbrist/drift/backend/internal/utils"
)

func main() {
	envCfg := utils.SetupEnvCfg()

	cfg := &handlers.APIConfig{
		Env: envCfg,
	}

	mux := http.NewServeMux()

	// HANDLERS HERE
	mux.HandleFunc("POST /login", cfg.LoginHandler)

	handler := middleware.CORS("http://localhost:5174")(mux)
	srv := &http.Server{
		Addr:    ":" + cfg.Env.Port,
		Handler: handler,
	}

	log.Printf("Serving on: http://localhost:%s/\n", cfg.Env.Port)
	log.Fatal(srv.ListenAndServe())
}
