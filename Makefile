.PHONY: backend frontend dev install build

backend:
	cd backend && npm run dev

frontend:
	cd frontend && npm run dev

dev:
	@echo "Run 'make backend' and 'make frontend' in separate terminals"

install:
	cd backend && npm install
	cd frontend && npm install

build:
	cd backend && npm run build
	cd frontend && npx next build
