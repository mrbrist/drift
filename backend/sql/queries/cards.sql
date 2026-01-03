-- name: IsCardOwner :one
SELECT EXISTS (
        SELECT 1
        FROM cards c
            JOIN board_columns bc ON bc.id = c.column_id
            JOIN boards b ON b.id = bc.board_id
        WHERE c.id = $1
            AND b.user_id = $2
    );
-- name: CreateCard :one
INSERT INTO cards (id, column_id, title, description, position)
VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4
    )
RETURNING *;
-- name: GetCard :one
-- name: UpdateCard :one
-- name: DeleteCard :exec