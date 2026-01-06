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
SELECT *
FROM cards
where id = $1;
-- name: UpdateCard :one
UPDATE cards
SET title = $2,
    description = $3,
    position = $4,
    column_id = $5,
    updated_at = NOW()
WHERE id = $1
RETURNING *;
-- name: DeleteCard :exec
DELETE FROM cards
WHERE id = $1;