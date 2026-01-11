package models

import (
	"time"

	"github.com/google/uuid"
)

type Card struct {
	ID          uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	Description *string   `json:"description"`
	Position    float64   `json:"position"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Column struct {
	ID        uuid.UUID `json:"id"`
	Title     string    `json:"title"`
	Position  float64   `json:"position"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Cards     []Card    `json:"cards"`
}

type BoardResponse struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Columns   []Column  `json:"columns"`
}

type Board struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type User struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	Firstname string    `json:"first_name"`
	Lastname  string    `json:"last_name"`
	Email     string    `json:"email"`
	IsAdmin   bool      `json:"id_admin"`
}
type BoardParams struct {
	BoardID uuid.UUID `json:"id"`
}
type UpdateBoardParams struct {
	Title string `json:"title"`
}
type ColumnParams struct {
	ColumnID uuid.UUID `json:"id"`
}
type CardParams struct {
	CardID uuid.UUID `json:"id"`
}
type NewColumnParams struct {
	Title    string  `json:"title"`
	Position float64 `json:"position"`
}

type UpdateColumnParams struct {
	ID       uuid.UUID `json:"id"`
	Title    string    `json:"title"`
	Position float64   `json:"position"`
}

type NewCardParams struct {
	ColumnID    uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Position    float64   `json:"position"`
}

type UpdateCardParams struct {
	ID          uuid.UUID `json:"id"`
	ColumnID    uuid.UUID `json:"column_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Position    float64   `json:"position"`
}
