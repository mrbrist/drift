package utils

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

type EnvCfg struct {
	Port           string
	JWTSecret      string
	GoogleClientID string
	DB_URL         string
	HTTPSameSite   http.SameSite
	IsProd         bool
}

func SetupEnvCfg() *EnvCfg {
	godotenv.Load(".env")

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT environment variable is not set")
	}

	jwt_secret := os.Getenv("JWT_SECRET")
	if jwt_secret == "" {
		log.Fatal("JWT_SECRET environment variable is not set")
	}

	google_client_id := os.Getenv("GOOGLE_CLIENT_ID")
	if google_client_id == "" {
		log.Fatal("GOOGLE_CLIENT_ID environment variable is not set")
	}

	db_url := os.Getenv("DB_URL")
	if db_url == "" {
		log.Fatal("DB_URL environment variable is not set")
	}

	prod := os.Getenv("PRODUCTION")
	if prod == "" {
		log.Fatal("PRODUCTION environment variable is not set")
	}

	httpSameSite := http.SameSiteNoneMode
	if prod == "false" {
		httpSameSite = http.SameSiteStrictMode
	}

	isprod := true
	if prod == "false" {
		isprod = false
	}

	return &EnvCfg{
		Port:           port,
		JWTSecret:      jwt_secret,
		GoogleClientID: google_client_id,
		DB_URL:         db_url,
		HTTPSameSite:   httpSameSite,
		IsProd:         isprod,
	}
}
