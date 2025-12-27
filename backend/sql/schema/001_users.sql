-- +goose Up
CREATE TABLE users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    session_token TEXT,
    csrf_token TEXT
);

-- +goose Down
DROP TABLE users;