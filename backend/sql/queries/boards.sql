-- name: IsBoardOwner :one
SELECT EXISTS (
        SELECT 1
        FROM boards
        WHERE id = $1
            AND user_id = $2
    );
-- name: GetBoard :one
SELECT b.id,
    b.user_id,
    b.title,
    b.created_at,
    b.updated_at,
    COALESCE(
        json_agg(
            jsonb_build_object(
                'id',
                bc.id,
                'title',
                bc.title,
                'position',
                bc.position,
                'created_at',
                bc.created_at,
                'updated_at',
                bc.updated_at,
                'cards',
                COALESCE(bc.cards, '[]'::json)
            )
            ORDER BY bc.position
        ) FILTER (
            WHERE bc.id IS NOT NULL
        ),
        '[]'::json
    ) AS columns
FROM boards b
    LEFT JOIN (
        SELECT c.id,
            c.board_id,
            c.title,
            c.position,
            c.created_at,
            c.updated_at,
            json_agg(
                jsonb_build_object(
                    'id',
                    ca.id,
                    'title',
                    ca.title,
                    'description',
                    ca.description,
                    'position',
                    ca.position,
                    'created_at',
                    ca.created_at,
                    'updated_at',
                    ca.updated_at
                )
                ORDER BY ca.position
            ) FILTER (
                WHERE ca.id IS NOT NULL
            ) AS cards
        FROM board_columns c
            LEFT JOIN cards ca ON ca.column_id = c.id
        GROUP BY c.id
    ) bc ON bc.board_id = b.id
WHERE b.id = $1
GROUP BY b.id;
-- name: GetBoardByID :one
SELECT *
FROM boards
WHERE id = $1;
-- name: CreateBoard :one
WITH new_board AS (
    INSERT INTO boards (
            id,
            user_id,
            title,
            created_at,
            updated_at
        )
    VALUES (
            gen_random_uuid(),
            $1,
            $2,
            NOW(),
            NOW()
        )
    RETURNING *
),
default_columns AS (
    INSERT INTO board_columns (
            id,
            board_id,
            title,
            position,
            created_at,
            updated_at
        )
    SELECT gen_random_uuid(),
        new_board.id,
        col.title,
        col.position,
        NOW(),
        NOW()
    FROM new_board
        JOIN (
            VALUES ('Todo', 1),
                ('In Progress', 2),
                ('Done', 3)
        ) AS col(title, position) ON TRUE
)
SELECT *
FROM new_board;
-- name: UpdateBoard :one
UPDATE boards
SET title = $2,
    updated_at = NOW()
WHERE id = $1
RETURNING *;
-- name: GetBoardsForUser :many
SELECT *
FROM boards
WHERE user_id = $1
ORDER BY created_at;
-- name: DeleteBoard :exec
DELETE FROM boards
WHERE id = $1;