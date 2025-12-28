package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/lib/pq"

	"github.com/mrbrist/drift/backend/internal/database"
	"github.com/mrbrist/drift/backend/internal/handlers"
	"github.com/mrbrist/drift/backend/internal/middleware"
	"github.com/mrbrist/drift/backend/internal/utils"
)

func main() {
	envCfg := utils.SetupEnvCfg()

	db, err := sql.Open("postgres", envCfg.DB_URL)
	if err != nil {
		log.Fatal(err)
	}
	dbQueries := database.New(db)

	cfg := &handlers.APIConfig{
		Env: envCfg,
		DB:  dbQueries,
	}

	mux := http.NewServeMux()

	// HANDLERS HERE
	mux.HandleFunc("POST /api/login", cfg.LoginHandler)
	mux.HandleFunc("/api/logout", cfg.LogoutHandler)
	mux.Handle("GET /api/protected", cfg.AuthMiddleware(http.HandlerFunc(cfg.ProtectedHandler)))

	srv := &http.Server{
		Addr:    ":" + cfg.Env.Port,
		Handler: middleware.CORSMiddleware(mux),
	}

	log.Printf("Serving on: http://localhost:%s/\n", cfg.Env.Port)
	log.Fatal(srv.ListenAndServe())
}
