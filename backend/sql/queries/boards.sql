-- name: GetBoardByID :one
SELECT
    b.id,
    b.user_id,
    b.title,
    b.created_at,
    b.updated_at,

    COALESCE(
        JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
                'id', c.id,
                'title', c.title,
                'position', c.position,
                'created_at', c.created_at,
                'updated_at', c.updated_at,
                'cards', COALESCE(cards.cards, '[]'::json)
            )
            ORDER BY c.position
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'
    ) AS columns

FROM boards b
LEFT JOIN board_columns c
    ON c.board_id = b.id

LEFT JOIN LATERAL (
    SELECT
        JSON_AGG(
            JSONB_BUILD_OBJECT(
                'id', cd.id,
                'title', cd.title,
                'description', cd.description,
                'position', cd.position,
                'created_at', cd.created_at,
                'updated_at', cd.updated_at
            )
            ORDER BY cd.position
        ) AS cards
    FROM cards cd
    WHERE cd.column_id = c.id
) cards ON TRUE

WHERE b.id = $1
GROUP BY b.id;

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
        $1,            -- user_id
        $2,            -- board title
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
    SELECT
        gen_random_uuid(),
        new_board.id,
        col.title,
        col.position,
        NOW(),
        NOW()
    FROM new_board
    JOIN (
        VALUES
            ('Todo', 1),
            ('In Progress', 2),
            ('Done', 3)
    ) AS col(title, position)
    ON TRUE
)
SELECT
    id,
    user_id,
    title,
    created_at,
    updated_at
FROM new_board;

-- name: GetBoardsForUser :many
SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at;

-- name: DeleteBoard :exec
DELETE FROM boards WHERE id = $1;
