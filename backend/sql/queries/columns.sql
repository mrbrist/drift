-- name: IsColumnOwner :one
SELECT EXISTS (
        SELECT 1
        FROM board_columns bc
            JOIN boards b ON b.id = bc.board_id
        WHERE bc.id = $1
            AND b.user_id = $2
    );
-- name: CreateColumn :one
-- name: GetColumn :one
-- name: UpdateColumn :one
-- name: DeleteColumn :exec