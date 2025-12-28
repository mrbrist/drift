package handlers

import (
	"github.com/mrbrist/drift/backend/internal/database"
	"github.com/mrbrist/drift/backend/internal/utils"
)

type APIConfig struct {
	Env *utils.EnvCfg
	DB  *database.Queries
}
