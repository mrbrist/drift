-- name: CreateUser :one
INSERT INTO users (id, created_at, firstname, lastname, email)
VALUES (
        gen_random_uuid(),
        now(),
        $1,
        $2,
        $3
    )
RETURNING *;
-- name: UserExistsByEmail :one
SELECT EXISTS (
        SELECT 1
        FROM users
        WHERE email = $1
    );
-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE email = $1;
-- name: GetUserByID :one
SELECT *
FROM users
WHERE id = $1;
-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;
-- name: UpdateUser :one
UPDATE users
SET firstname = $2,
    lastname = $3,
    email = $4
WHERE id = $1
RETURNING *;