-- name: IsColumnOwner :one
SELECT EXISTS (
        SELECT 1
        FROM board_columns bc
            JOIN boards b ON b.id = bc.board_id
        WHERE bc.id = $1
            AND b.user_id = $2
    );
-- name: CreateColumn :one
INSERT INTO board_columns (
        id,
        board_id,
        title,
        position,
        created_at,
        updated_at
    )
VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        NOW(),
        NOW()
    )
RETURNING *;
-- name: GetColumnsForBoard :many
SELECT *
FROM board_columns
WHERE board_id = $1
ORDER BY position ASC;
-- name: GetColumn :one
SELECT *
FROM board_columns
where id = $1;
-- name: UpdateColumn :one
UPDATE board_columns
SET title = $2,
    position = $3,
    updated_at = NOW()
WHERE id = $1
RETURNING *;
-- name: DeleteColumn :exec
DELETE FROM board_columns
WHERE id = $1;