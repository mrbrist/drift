package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/mrbrist/drift/backend/internal/database"
	"github.com/mrbrist/drift/backend/internal/models"
	"github.com/mrbrist/drift/backend/internal/utils"
)

func (cfg *APIConfig) GetUser(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(database.User)

	resp := models.User{
		ID:        user.ID,
		CreatedAt: user.CreatedAt,
		Firstname: user.Firstname,
		Lastname:  user.Lastname,
		Email:     user.Email,
		IsAdmin:   user.IsAdmin,
	}

	utils.RespondWithJSON(w, 200, resp)
}

func (cfg *APIConfig) GetBoards(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(userContextKey).(database.User)

	boards, err := cfg.DB.GetBoardsForUser(r.Context(), user.ID)
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't get boards for user", err)
		return
	}
	if len(boards) > 0 {
		resp := make([]models.Board, len(boards))
		for i, b := range boards {
			resp[i] = models.Board{
				ID:        b.ID,
				UserID:    b.UserID,
				Title:     b.Title,
				CreatedAt: b.CreatedAt,
				UpdatedAt: b.UpdatedAt,
			}
		}

		utils.RespondWithJSON(w, 200, resp)

	} else {
		var empty []models.Board
		utils.RespondWithJSON(w, 200, empty)
	}
}

/*
BOARD HANDLERS
*/
func (cfg *APIConfig) GetBoard(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	boardID := ctx.Value(boardIdContextKey).(uuid.UUID)

	// Fetch board
	board, err := cfg.DB.GetBoardByID(ctx, boardID)
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't get board", err)
		return
	}

	// Fetch columns
	dbColumns, err := cfg.DB.GetColumnsForBoard(ctx, boardID)
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't get columns", err)
		return
	}

	columns := make([]models.Column, 0, len(dbColumns))

	for _, dbCol := range dbColumns {
		// Fetch cards for column
		dbCards, err := cfg.DB.GetCardsForColumn(ctx, dbCol.ID)
		if err != nil {
			utils.RespondWithError(w, 500, "Couldn't get cards for column", err)
			return
		}

		cards := make([]models.Card, 0, len(dbCards))
		for _, dbCard := range dbCards {
			var desc *string
			if dbCard.Description.Valid {
				desc = &dbCard.Description.String
			}

			cards = append(cards, models.Card{
				ID:          dbCard.ID,
				Title:       dbCard.Title,
				Description: desc,
				Position:    dbCard.Position,
				CreatedAt:   dbCard.CreatedAt,
				UpdatedAt:   dbCard.UpdatedAt,
			})
		}

		columns = append(columns, models.Column{
			ID:        dbCol.ID,
			Title:     dbCol.Title,
			Position:  dbCol.Position,
			CreatedAt: dbCol.CreatedAt,
			UpdatedAt: dbCol.UpdatedAt,
			Cards:     cards,
		})
	}

	resp := models.BoardResponse{
		ID:        board.ID,
		UserID:    board.UserID,
		Title:     board.Title,
		CreatedAt: board.CreatedAt,
		UpdatedAt: board.UpdatedAt,
		Columns:   columns,
	}

	utils.RespondWithJSON(w, http.StatusOK, resp)
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

	resp := models.Board{
		ID:        board.ID,
		UserID:    board.UserID,
		Title:     board.Title,
		CreatedAt: board.CreatedAt,
		UpdatedAt: board.UpdatedAt,
	}

	utils.RespondWithJSON(w, 200, resp)
}

func (cfg *APIConfig) UpdateBoard(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	params := models.UpdateBoardParams{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}
	board, err := cfg.DB.UpdateBoard(r.Context(), database.UpdateBoardParams{
		Title: params.Title,
	})
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't create board", err)
		return
	}

	resp := models.Board{
		ID:        board.ID,
		UserID:    board.UserID,
		Title:     board.Title,
		CreatedAt: board.CreatedAt,
		UpdatedAt: board.UpdatedAt,
	}

	utils.RespondWithJSON(w, 200, resp)
}

func (cfg *APIConfig) DeleteBoard(w http.ResponseWriter, r *http.Request) {
	board_id := r.Context().Value(boardIdContextKey).(uuid.UUID)

	err := cfg.DB.DeleteBoard(r.Context(), board_id)
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't delete board", err)
		return
	}
	w.WriteHeader(200)
}

/*
COLUMN HANDLERS
*/
func (cfg *APIConfig) GetColumn(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	params := models.ColumnParams{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	col, err := cfg.DB.GetColumn(r.Context(), params.ColumnID)
	if err != nil {
		utils.RespondWithError(w, 404, "Could not get column", err)
		return
	}

	utils.RespondWithJSON(w, 200, col)
}

func (cfg *APIConfig) NewColumn(w http.ResponseWriter, r *http.Request) {
	board_id := r.Context().Value(boardIdContextKey).(uuid.UUID)
	decoder := json.NewDecoder(r.Body)
	params := models.NewColumnParams{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	col, err := cfg.DB.CreateColumn(r.Context(), database.CreateColumnParams{
		BoardID:  board_id,
		Title:    params.Title,
		Position: params.Position,
	})
	if err != nil {
		utils.RespondWithError(w, 500, "Could not create column", err)
		return
	}

	utils.RespondWithJSON(w, 200, col)
}

func (cfg *APIConfig) UpdateColumn(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	params := models.UpdateColumnParams{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	col, err := cfg.DB.UpdateColumn(r.Context(), database.UpdateColumnParams{
		ID:       params.ID,
		Title:    params.Title,
		Position: params.Position,
	})
	if err != nil {
		utils.RespondWithError(w, 500, "Could not update column", err)
		return
	}

	utils.RespondWithJSON(w, 200, models.Column{
		ID:        col.ID,
		Title:     col.Title,
		Position:  col.Position,
		CreatedAt: col.CreatedAt,
		UpdatedAt: col.UpdatedAt,
	})
}

func (cfg *APIConfig) DeleteColumn(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	params := models.ColumnParams{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	err = cfg.DB.DeleteColumn(r.Context(), params.ColumnID)
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't delete column", err)
		return
	}
	w.WriteHeader(200)
}

/*
CARD HANDLERS
*/
func (cfg *APIConfig) GetCard(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	params := models.CardParams{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	card, err := cfg.DB.GetCard(r.Context(), params.CardID)
	if err != nil {
		utils.RespondWithError(w, 404, "Could not get card", err)
		return
	}

	utils.RespondWithJSON(w, 200, models.Card{
		ID:          card.ID,
		Title:       card.Title,
		Description: &card.Description.String,
		Position:    card.Position,
		CreatedAt:   card.CreatedAt,
		UpdatedAt:   card.UpdatedAt,
	})
}

func (cfg *APIConfig) NewCard(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	params := models.NewCardParams{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	desc := sql.NullString{
		String: params.Description,
		Valid:  true,
	}

	// Get the last card in the column (highest position)
	lastCard, err := cfg.DB.GetLastCardForColumn(r.Context(), params.ColumnID)
	if err != nil && err != sql.ErrNoRows {
		utils.RespondWithError(w, http.StatusInternalServerError, "Couldn't get last card in column", err)
		return
	}

	var newPosition float64 = 1024 // default if column empty
	if err == nil {
		newPosition = lastCard.Position + 1024
	}

	card, err := cfg.DB.CreateCard(r.Context(), database.CreateCardParams{
		ColumnID:    params.ColumnID,
		Title:       params.Title,
		Description: desc,
		Position:    newPosition,
	})
	if err != nil {
		utils.RespondWithError(w, 500, "Could not create card", err)
		return
	}

	utils.RespondWithJSON(w, 200, models.Card{
		ID:          card.ID,
		Title:       card.Title,
		Description: &card.Description.String,
		Position:    card.Position,
		CreatedAt:   card.CreatedAt,
		UpdatedAt:   card.UpdatedAt,
	})
}

func (cfg *APIConfig) UpdateCard(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	params := models.UpdateCardParams{}
	if err := decoder.Decode(&params); err != nil {
		utils.RespondWithError(w, 400, "Couldn't decode parameters", err)
		return
	}

	existing, err := cfg.DB.GetCard(r.Context(), params.ID)
	if err != nil {
		utils.RespondWithError(w, 404, "Card not found", err)
		return
	}

	columnID := existing.ColumnID
	if params.ColumnID != nil {
		columnID = *params.ColumnID
	}

	title := existing.Title
	if params.Title != nil {
		title = *params.Title
	}

	position := existing.Position
	if params.Position != nil {
		position = *params.Position
	}

	desc := sql.NullString{
		String: existing.Description.String,
		Valid:  existing.Description.Valid,
	}

	if params.Description != nil {
		desc = sql.NullString{
			String: *params.Description,
			Valid:  true,
		}
	}

	card, err := cfg.DB.UpdateCard(r.Context(), database.UpdateCardParams{
		ID:          params.ID,
		ColumnID:    columnID,
		Title:       title,
		Description: desc,
		Position:    position,
	})
	if err != nil {
		utils.RespondWithError(w, 500, "Could not update card", err)
		return
	}

	utils.RespondWithJSON(w, 200, models.Card{
		ID:          card.ID,
		Title:       card.Title,
		Description: &card.Description.String,
		Position:    card.Position,
		CreatedAt:   card.CreatedAt,
		UpdatedAt:   card.UpdatedAt,
		ColumnID:    card.ColumnID,
	})
}

func (cfg *APIConfig) DeleteCard(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	params := models.CardParams{}
	err := decoder.Decode(&params)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	err = cfg.DB.DeleteCard(r.Context(), params.CardID)
	if err != nil {
		utils.RespondWithError(w, 500, "Couldn't delete card", err)
		return
	}

	w.WriteHeader(200)
}
