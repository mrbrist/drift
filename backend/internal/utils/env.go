package utils

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type EnvCfg struct {
	Port string
}

func SetupEnvCfg() *EnvCfg {
	godotenv.Load(".env")

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT environment variable is not set")
	}

	return &EnvCfg{
		Port: port,
	}
}
