include backend/.env

start-be:
	cd backend && go run .

generatesql:
	cd backend && sqlc generate

gooseup:
	cd backend && goose postgres $(DB_URL) -dir "sql/schema" up

goosedown:
	cd backend && goose postgres $(DB_URL) -dir "sql/schema" down

goosereset:
	cd backend && goose postgres $(DB_URL) -dir "sql/schema" reset

start-fe:
	cd frontend-v2 && npm run dev

dev: start-be start-fe
	echo "STARTING DEV ENVIRONMENT\n"
