package handlers

import (
	"net/http"

	"github.com/mrbrist/drift/backend/internal/utils"
)

func (cfg *APIConfig) AppHandler(w http.ResponseWriter, r *http.Request) {
	utils.RespondWithJSON(w, 200, r.Context().Value(userContextKey))
}
