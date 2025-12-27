include backend/.env

start-be:
	cd backend && go run .

generatesql:
	cd backend && sqlc generate

gooseup:
	cd backend && goose postgres $(DATABASE_URL) -dir "sql/schema" up

goosedown:
	cd backend && goose postgres $(DATABASE_URL) -dir "sql/schema" down

start-fe:
	cd frontend && echo "\nIMPLEMENT THIS"