package handlers

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/mrbrist/drift/backend/internal/database"
	"github.com/mrbrist/drift/backend/internal/utils"
)

func (cfg *APIConfig) GetUser(w http.ResponseWriter, r *http.Request) {
	utils.RespondWithJSON(w, 200, r.Context().Value(userContextKey))
}

func (cfg *APIConfig) GetBoards(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(database.User)

	boards, err := cfg.DB.GetBoardsForUser(r.Context(), user.ID)
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't get boards for user", err)
		return
	}
	if len(boards) > 0 {
		utils.RespondWithJSON(w, 200, boards)

	} else {
		var empty []database.Board
		utils.RespondWithJSON(w, 200, empty)
	}
}

func (cfg *APIConfig) NewBoard(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(database.User)

	board, err := cfg.DB.CreateBoard(r.Context(), database.CreateBoardParams{
		UserID: user.ID,
		Title:  "New Board",
	})
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't create board", err)
		return
	}
	utils.RespondWithJSON(w, 200, board)
}

func (cfg *APIConfig) DeleteBoard(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	board_id, err := uuid.Parse(id)
	if err != nil {
		utils.RespondWithError(w, 500, "You need to specify a board id", err)
		return
	}

	err = cfg.DB.DeleteBoard(r.Context(), board_id)
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't create board", err)
		return
	}
	w.WriteHeader(200)
}
