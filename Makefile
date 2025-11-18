.PHONY: help build test run clean install docker-build docker-run validate lint commit

# Variables
IMAGE_NAME = dvd-calculator
EXAMPLE_FILE = examples/example1.txt

help: ## Affiche l'aide
	@echo "Commandes disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Installe les dépendances
	npm install

build: ## Compile le projet TypeScript
	npm run build

lint: ## Vérifie la qualité du code avec ESLint
	npm run lint

lint-fix: ## Corrige automatiquement les problèmes ESLint
	npm run lint:fix

commit: ## Créer un commit sémantique avec Commitizen
	npm run commit

test: ## Lance les tests
	npm test

test-coverage: ## Lance les tests avec couverture
	npm run test:coverage

validate: ## Validation complète (tests + exemples)
	./validate.sh

run: build ## Exécute avec un fichier exemple
	node dist/index.js $(EXAMPLE_FILE)

clean: ## Nettoie les fichiers générés
	rm -rf dist coverage node_modules

docker-build: ## Build l'image Docker
	docker build -t $(IMAGE_NAME) .

docker-run: ## Exécute avec Docker (fichier exemple)
	docker run --rm -v $$(pwd)/examples:/app/examples $(IMAGE_NAME) examples/example1.txt

docker-interactive: ## Mode interactif Docker
	docker run --rm -it $(IMAGE_NAME)

docker-test: docker-build ## Teste tous les exemples avec Docker
	@echo "Test Example 1 (expected: 36):"
	@docker run --rm -v $$(pwd)/examples:/app/examples $(IMAGE_NAME) examples/example1.txt
	@echo "\nTest Example 2 (expected: 27):"
	@docker run --rm -v $$(pwd)/examples:/app/examples $(IMAGE_NAME) examples/example2.txt
	@echo "\nTest Example 3 (expected: 15):"
	@docker run --rm -v $$(pwd)/examples:/app/examples $(IMAGE_NAME) examples/example3.txt
	@echo "\nTest Example 4 (expected: 48):"
	@docker run --rm -v $$(pwd)/examples:/app/examples $(IMAGE_NAME) examples/example4.txt
	@echo "\nTest Example 5 (expected: 56):"
	@docker run --rm -v $$(pwd)/examples:/app/examples $(IMAGE_NAME) examples/example5.txt

docker-compose-run: ## Exécute avec docker-compose
	docker-compose run --rm dvd-calculator examples/example1.txt

all: install build lint test validate ## Installation complète et validation

quick-start: install build run ## Démarrage rapide (install + build + run exemple)

ci: install lint build test ## Pipeline CI (lint + build + test)
