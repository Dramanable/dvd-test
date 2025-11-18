# DVD Shop Calculator# DVD Shop Calculator# DVD Shop Calculator# DVD Shop Calculator# DVD Shop Price Calculator# DVD Shop Price Calculator



![CI](https://github.com/VOTRE_USERNAME/ekinox/workflows/CI/badge.svg)

![Node](https://img.shields.io/badge/node-24.x-brightgreen)

![TypeScript](https://img.shields.io/badge/typescript-5.3-blue)![CI](https://github.com/VOTRE_USERNAME/ekinox/workflows/CI/badge.svg)

![Tests](https://img.shields.io/badge/tests-34%20passing-brightgreen)

![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)![Node](https://img.shields.io/badge/node-24.x-brightgreen)

![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)

![License](https://img.shields.io/badge/license-ISC-blue)![TypeScript](https://img.shields.io/badge/typescript-5.3-blue)Calculateur de prix pour boutique de DVD avec promotions sur la saga "Back to the Future".



Calculateur de prix pour boutique de DVD avec promotions sur la saga "Back to the Future".![Tests](https://img.shields.io/badge/tests-34%20passing-brightgreen)



## 🚀 Démarrage rapide![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)



```bash![License](https://img.shields.io/badge/license-ISC-blue)

# Voir toutes les commandes disponibles

make help## 🚀 Démarrage rapideCalculateur de prix pour boutique de DVD avec promotions sur la saga "Back to the Future".



# Démarrage rapide completCalculateur de prix pour boutique de DVD avec promotions sur la saga "Back to the Future".

make quick-start



# Pipeline CI complet

make ci## 🚀 Démarrage rapide



# Build et test avec Docker```bash

make docker-build

make docker-test```bash

```

# Voir toutes les commandes disponibles# Voir toutes les commandes disponibles

## 📋 Commandes Makefile

make help

| Commande | Description |

|----------|-------------|make help## 🚀 Démarrage rapide avec DockerCalculateur de prix pour boutique de DVD avec promotions sur la saga "Back to the Future".[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

| `make help` | Affiche l'aide |

| `make quick-start` | Installation + build + exécution |# Démarrage rapide complet

| `make install` | Installe les dépendances |

| `make build` | Compile le projet TypeScript |make quick-start

| `make lint` | Vérifie la qualité du code (ESLint) |

| `make lint-fix` | Corrige automatiquement les problèmes |

| `make commit` | Créer un commit sémantique (Commitizen) |

| `make test` | Lance les 34 tests |# Pipeline CI complet# Démarrage rapide complet

| `make test-coverage` | Tests avec couverture |

| `make validate` | Validation complète (script) |make ci

| `make run` | Exécute avec example1.txt |

| `make docker-build` | Build l'image Docker |make quick-start

| `make docker-run` | Exécute avec Docker |

| `make docker-test` | Teste tous les exemples Docker |# Build et test avec Docker

| `make docker-interactive` | Mode interactif Docker |

| `make ci` | Pipeline CI (lint + build + test) |make docker-build```bash[![Tests](https://img.shields.io/badge/tests-34%20passing-brightgreen)](.)

| `make all` | Installation complète + validation |

| `make clean` | Nettoie les fichiers générés |make docker-test



## 💰 Règles métier```# Build et test avec Docker



**Tarifs** :

- Back to the Future : 15€

- Autres films : 20€## 📋 Commandes Makefilemake docker-build# Build l'image



**Promotions (BTTF uniquement)** :

- 2 volets différents → 10% de réduction sur tous les DVDs BTTF

- 3 volets différents → 20% de réduction sur tous les DVDs BTTF| Commande | Description |make docker-test



## 📊 Exemples|----------|-------------|



| Panier | Calcul | Résultat || `make help` | Affiche l'aide |```docker build -t dvd-calculator .## Installation et lancement[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](.)

|--------|--------|----------|

| 3 volets BTTF | (15×3)×0.8 | **36€** || `make quick-start` | Installation + build + exécution |

| 2 volets BTTF | (15×2)×0.9 | **27€** |

| 1 volet BTTF | 15×1 | **15€** || `make install` | Installe les dépendances |

| 4 DVDs (3 volets) | (15×4)×0.8 | **48€** |

| 3 BTTF + 1 autre | (15×3)×0.8+20 | **56€** || `make build` | Compile le projet TypeScript |



## 🧪 Tests & Qualité| `make lint` | Vérifie la qualité du code (ESLint) |## 📋 Commandes Makefile



### Tests| `make lint-fix` | Corrige automatiquement les problèmes |



```bash| `make test` | Lance les 34 tests |

make test              # 34 tests

make test-coverage     # Couverture 100%| `make test-coverage` | Tests avec couverture |

make validate          # Validation complète

```| `make validate` | Validation complète (script) || Commande | Description |# Utiliser avec un fichier



**Résultats** :| `make run` | Exécute avec example1.txt |

- ✅ 34 tests passent

- ✅ 4 test suites| `make docker-build` | Build l'image Docker ||----------|-------------|

- ✅ Couverture 100%

- ✅ 5 exemples validés| `make docker-run` | Exécute avec Docker |

- ✅ Structure `__tests__` organisée

| `make docker-test` | Teste tous les exemples Docker || `make help` | Affiche l'aide |docker run --rm -v $(pwd)/examples:/app/examples dvd-calculator examples/example1.txt

### Qualité du code (ESLint)

| `make docker-interactive` | Mode interactif Docker |

```bash

make lint              # Vérification ESLint| `make ci` | Pipeline CI (lint + build + test) || `make quick-start` | Installation + build + exécution |

make lint-fix          # Correction automatique

```| `make all` | Installation complète + validation |



**Règles appliquées** :| `make clean` | Nettoie les fichiers générés || `make install` | Installe les dépendances |### PrérequisCalculateur de prix pour une boutique de DVD avec promotions sur la saga "Back to the Future".

- ✅ TypeScript strict

- ✅ Pas de `any`

- ✅ Fonctions explicitement typées

- ✅ Pas de variables inutilisées## 💰 Règles métier| `make build` | Compile le projet TypeScript |

- ✅ Pas de promesses non gérées

- ✅ Code style cohérent



## 🏗️ Architecture**Tarifs** :| `make test` | Lance les 34 tests |# Utiliser avec pipe



**Clean Architecture + TDD** :- Back to the Future : 15€



```- Autres films : 20€| `make test-coverage` | Tests avec couverture |

src/

├── domain/              # Entités métier (0 dépendance)

│   └── entities/

│       ├── __tests__/   # Tests unitaires**Promotions (BTTF uniquement)** :| `make validate` | Validation complète (script) |echo -e "Back to the Future 1\nBack to the Future 2\nBack to the Future 3" | docker run --rm -i dvd-calculator- Node.js v18+ 

│       ├── Movie.ts

│       └── Cart.ts- 2 volets différents → 10% de réduction sur tous les DVDs BTTF

├── application/         # Use cases, orchestration

│   ├── use-cases/- 3 volets différents → 20% de réduction sur tous les DVDs BTTF| `make run` | Exécute avec example1.txt |

│   │   ├── __tests__/   # Tests use cases

│   │   └── CalculateCartPrice.ts

│   ├── ports/           # Interfaces (IInputParser)

│   └── DVDCalculatorApp.ts## 📊 Exemples| `make docker-build` | Build l'image Docker |

├── infrastructure/      # Adapters

│   ├── __tests__/       # Tests adapters

│   └── InputParser.ts

└── index.ts            # CLI + Dependency Injection| Panier | Calcul | Résultat || `make docker-run` | Exécute avec Docker |

```

|--------|--------|----------|

**Principes appliqués** :

- ✅ Test-Driven Development| 3 volets BTTF | (15×3)×0.8 | **36€** || `make docker-test` | Teste tous les exemples Docker |# Mode interactif- npm v9+## 📋 Table des matières

- ✅ SOLID principles

- ✅ Dependency Inversion| 2 volets BTTF | (15×2)×0.9 | **27€** |

- ✅ Clean Architecture

- ✅ TypeScript strict mode| 1 volet BTTF | 15×1 | **15€** || `make docker-interactive` | Mode interactif Docker |

- ✅ ESLint (qualité du code)

- ✅ Tests dans dossiers `__tests__`| 4 DVDs (3 volets) | (15×4)×0.8 | **48€** |



## 🐳 Docker| 3 BTTF + 1 autre | (15×3)×0.8+20 | **56€** || `make all` | Installation complète + validation |docker run --rm -it dvd-calculator



### Build et exécution



```bash## 🧪 Tests & Qualité| `make clean` | Nettoie les fichiers générés |

make docker-build

make docker-run

make docker-test

```### Tests```



### Commandes manuelles



```bash```bash## 💰 Règles métier

# Build

docker build -t dvd-calculator .make test              # 34 tests



# Exécuter avec fichiermake test-coverage     # Couverture 100%

docker run --rm -v $(pwd)/examples:/app/examples dvd-calculator examples/example1.txt

make validate          # Validation complète

# Mode interactif

docker run --rm -it dvd-calculator```**Tarifs** :



# Avec pipe

echo -e "Back to the Future 1\nBack to the Future 2" | docker run --rm -i dvd-calculator

```**Résultats** :- Back to the Future : 15€### Avec Docker Compose### Installation- [Présentation](#présentation)



## 📝 Utilisation- ✅ 34 tests passent



### Mode 1 : Fichier- ✅ 4 test suites- Autres films : 20€



```bash- ✅ Couverture 100%

make run                          # Utilise example1.txt par défaut

node dist/index.js input.txt      # Avec un fichier custom- ✅ 5 exemples validés

```



### Mode 2 : Pipe

### Qualité du code (ESLint)**Promotions (BTTF uniquement)** :

```bash

echo -e "Back to the Future 1\nBack to the Future 2" | node dist/index.js

```

```bash- 2 volets différents → 10% de réduction sur tous les DVDs BTTF```bash```bash- [Architecture](#architecture)

### Mode 3 : Interactif

make lint              # Vérification ESLint

```bash

node dist/index.jsmake lint-fix          # Correction automatique- 3 volets différents → 20% de réduction sur tous les DVDs BTTF

# Entrez les titres ligne par ligne

# Ctrl+D pour terminer```

```

# Build et run

## 📦 Sans Makefile

**Règles appliquées** :

```bash

# Installation- ✅ TypeScript strict## 📊 Exemples

npm install

npm run build- ✅ Pas de `any`



# Tests & Lint- ✅ Fonctions explicitement typéesdocker-compose run --rm dvd-calculator examples/example1.txtnpm install- [Installation](#installation)

npm run lint

npm test- ✅ Pas de variables inutilisées

./validate.sh

- ✅ Pas de promesses non gérées| Panier | Calcul | Résultat |

# Exécution

node dist/index.js examples/example1.txt- ✅ Code style cohérent

```

|--------|--------|----------|

## 🔄 GitHub Actions CI/CD

## 🏗️ Architecture

Le projet utilise GitHub Actions pour l'intégration continue :

| 3 volets BTTF | (15×3)×0.8 | **36€** |

### Workflows disponibles

**Clean Architecture + TDD** :

#### CI (`.github/workflows/ci.yml`)

Déclenché sur push/PR vers `main`, `master`, `develop` :| 2 volets BTTF | (15×2)×0.9 | **27€** |# Mode interactifnpm run build- [Utilisation](#utilisation)

- ✅ **Lint** : Vérification ESLint

- ✅ **Test** : Exécution des 34 tests + couverture```

- ✅ **Build** : Compilation TypeScript

- ✅ **Validate** : Validation des exemplessrc/| 1 volet BTTF | 15×1 | **15€** |

- ✅ **Docker** : Build et test de l'image Docker

├── domain/          # Entités métier (Movie, Cart) - 0 dépendance

#### Release (`.github/workflows/release.yml`)

Déclenché sur tags `v*` :├── application/     # Use cases, orchestration| 4 DVDs (3 volets) | (15×4)×0.8 | **48€** |docker-compose run --rm dvd-calculator

- 📦 Création d'une archive de release

- 🐳 Publication de l'image Docker├── infrastructure/  # Adapters (InputParser)

- 📝 Notes de release automatiques

└── index.ts        # CLI + Dependency Injection| 3 BTTF + 1 autre | (15×3)×0.8+20 | **56€** |

#### Dependency Review (`.github/workflows/dependency-review.yml`)

Déclenché sur PR :```

- 🔒 Revue des dépendances

- 🔍 Audit de sécurité npm``````- [Tests](#tests)

- ✅ Validation des commits sémantiques

**Principes appliqués** :

### Configuration requise

- ✅ Test-Driven Development## 🧪 Tests

Pour utiliser les workflows, configurez ces secrets GitHub :

- `DOCKER_USERNAME` : Nom d'utilisateur Docker Hub (optionnel)- ✅ SOLID principles

- `DOCKER_PASSWORD` : Token Docker Hub (optionnel)

- ✅ Dependency Inversion

### Badges

- ✅ Clean Architecture

Remplacez `VOTRE_USERNAME` dans les badges du README par votre nom d'utilisateur GitHub.

- ✅ TypeScript strict mode```bash

## 🤝 Contribution

- ✅ ESLint (qualité du code)

1. Fork le projet

2. Créez une branche (`git checkout -b feature/AmazingFeature`)make test              # 34 tests## 📦 Installation locale (alternative)- [Règles métier](#règles-métier)

3. Faites vos modifications et ajoutez des tests dans `__tests__/`

4. Commit avec Commitizen (`make commit` ou `npm run commit`)## 🐳 Docker

5. Push vers la branche (`git push origin feature/AmazingFeature`)

6. Ouvrez une Pull Requestmake test-coverage     # Couverture >85%



### Commits Sémantiques### Build et exécution



Ce projet utilise **Conventional Commits**. Utilisez `make commit` pour créer des commits guidés :make validate          # Validation complète



```bash```bash

make commit

# Format: type(scope): descriptionmake docker-build```

# Exemple: feat(cart): ajouter support multi-devises

```make docker-run



**Types de commits** :make docker-test```bash### Utilisation- [Structure du projet](#structure-du-projet)

- `feat`: ✨ Nouvelle fonctionnalité

- `fix`: 🐛 Correction de bug```

- `docs`: 📚 Documentation

- `test`: 🧪 Tests**Résultats** :

- `refactor`: ♻️ Refactorisation

- `style`: 💎 Formatage### Commandes manuelles

- `perf`: ⚡ Performance

- `build`: 📦 Build/dépendances- ✅ 34 tests passentnpm install

- `ci`: 🎡 CI/CD

- `chore`: 🔧 Maintenance```bash



Consultez [COMMITS.md](./COMMITS.md) pour plus de détails.# Build- ✅ 4 test suites



Les PR déclenchent automatiquement :docker build -t dvd-calculator .

- ✅ Linting ESLint

- ✅ Tests unitaires- ✅ Couverture >85%npm run build

- ✅ Build TypeScript

- ✅ Validation des exemples# Exécuter avec fichier

- ✅ Build Docker

- ✅ Revue des dépendancesdocker run --rm -v $(pwd)/examples:/app/examples dvd-calculator examples/example1.txt- ✅ 5 exemples validés



## 🎯 Validation complète



```bash# Mode interactifnode dist/index.js examples/example1.txt

make all

# oudocker run --rm -it dvd-calculator

make ci

```## 🏗️ Architecture



**Attendu** :# Avec pipe

```

✓ ESLint: No errorsecho -e "Back to the Future 1\nBack to the Future 2" | docker run --rm -i dvd-calculator```**Fichier texte** :## 🎯 Présentation

✓ Unit tests passed (34/34)

✓ Build successful```

✓ Example 1: 36 ✅

✓ Example 2: 27 ✅**Clean Architecture + TDD** :

✓ Example 3: 15 ✅

✓ Example 4: 48 ✅## 📝 Utilisation

✓ Example 5: 56 ✅



All validations passed successfully! ✨

```### Mode 1 : Fichier



## 📁 Structure complète```



``````bash

ekinox/

├── .github/make run                          # Utilise example1.txt par défautsrc/## 💰 Règles métier```bash

│   ├── workflows/

│   │   ├── ci.ymlnode dist/index.js input.txt      # Avec un fichier custom

│   │   ├── release.yml

│   │   └── dependency-review.yml```├── domain/          # Entités métier (Movie, Cart) - 0 dépendance

│   ├── WORKFLOWS.md

│   └── COMMIT_QUICKREF.md

├── .husky/

│   ├── commit-msg           # Validation commits### Mode 2 : Pipe├── application/     # Use cases, orchestration

│   └── pre-commit           # Lint + tests

├── src/

│   ├── domain/

│   │   └── entities/```bash├── infrastructure/  # Adapters (InputParser)

│   │       ├── __tests__/   # Tests entités

│   │       │   ├── Cart.test.tsecho -e "Back to the Future 1\nBack to the Future 2" | node dist/index.js

│   │       │   └── Movie.test.ts

│   │       ├── Cart.ts```└── index.ts        # CLI + Dependency Injection**Tarifs** :node dist/index.js input.txtCe projet implémente un système de calcul de prix pour une boutique de DVD avec des règles de réduction spécifiques pour la saga "Back to the Future". Il a été développé en suivant les principes du **Test-Driven Development (TDD)** et de la **Clean Architecture**.

│   │       └── Movie.ts

│   ├── application/

│   │   ├── use-cases/

│   │   │   ├── __tests__/   # Tests use cases### Mode 3 : Interactif```

│   │   │   │   └── CalculateCartPrice.test.ts

│   │   │   └── CalculateCartPrice.ts

│   │   ├── ports/

│   │   │   └── IInputParser.ts```bash- Back to the Future : 15€

│   │   └── DVDCalculatorApp.ts

│   ├── infrastructure/node dist/index.js

│   │   ├── __tests__/       # Tests infrastructure

│   │   │   └── InputParser.test.ts# Entrez les titres ligne par ligne**Principes appliqués** :

│   │   └── InputParser.ts

│   └── index.ts# Ctrl+D pour terminer

├── examples/

│   ├── example1.txt ... example5.txt```- ✅ Test-Driven Development- Autres films : 20€```

├── Dockerfile

├── docker-compose.yml

├── Makefile                 # ⭐ Point d'entrée principal

├── eslint.config.js## 📦 Sans Makefile- ✅ SOLID principles

├── commitlint.config.js

├── .cz-config.js

├── tsconfig.json

├── tsconfig.eslint.json```bash- ✅ Dependency Inversion

├── jest.config.js

├── package.json# Installation

├── README.md

├── CONTRIBUTING.mdnpm install- ✅ Clean Architecture

├── COMMITS.md

├── PROJECT_STATUS.mdnpm run build

└── validate.sh

```- ✅ TypeScript strict mode**Promotions (BTTF uniquement)** :### Fonctionnalités



## 🚀 Pour bien démarrer# Tests & Lint



```bashnpm run lint

# Clone le projet

cd ekinoxnpm test



# Option 1 : Tout en une commande./validate.sh## 🐳 Docker- 2 volets différents → 10% de réduction

make quick-start



# Option 2 : Docker

make docker-build && make docker-test# Exécution



# Option 3 : Pipeline CI completnode dist/index.js examples/example1.txt

make ci

```### Build et exécution- 3 volets différents → 20% de réduction**Pipe** :

# Option 4 : Validation complète

make all

```

## 🔄 GitHub Actions CI/CD

## 📄 Licence



ISC

Le projet utilise GitHub Actions pour l'intégration continue :```bash

---



**Node.js 24** • **TypeScript 5.3** • **Jest** • **ESLint** • **Commitizen** • **Clean Architecture** • **Docker** • **Makefile** • **GitHub Actions**

### Workflows disponiblesmake docker-build



#### CI (`.github/workflows/ci.yml`)make docker-run## 📋 Exemples```bash- ✅ Calcul automatique des prix avec réductions

Déclenché sur push/PR vers `main`, `master`, `develop` :

- ✅ **Lint** : Vérification ESLintmake docker-test

- ✅ **Test** : Exécution des 34 tests + couverture

- ✅ **Build** : Compilation TypeScript```

- ✅ **Validate** : Validation des exemples

- ✅ **Docker** : Build et test de l'image Docker



#### Release (`.github/workflows/release.yml`)### Commandes manuelles| Panier | Résultat |echo -e "Back to the Future 1\nBack to the Future 2" | node dist/index.js- ✅ Support de plusieurs modes d'entrée (fichier, stdin, interactif)

Déclenché sur tags `v*` :

- 📦 Création d'une archive de release

- 🐳 Publication de l'image Docker

- 📝 Notes de release automatiques```bash|--------|----------|



#### Dependency Review (`.github/workflows/dependency-review.yml`)# Build

Déclenché sur PR :

- 🔒 Revue des dépendancesdocker build -t dvd-calculator .| 3 volets BTTF | 36€ |```- ✅ Architecture propre et testable

- 🔍 Audit de sécurité npm



### Configuration requise

# Exécuter avec fichier| 2 volets BTTF | 27€ |

Pour utiliser les workflows, configurez ces secrets GitHub :

- `DOCKER_USERNAME` : Nom d'utilisateur Docker Hub (optionnel)docker run --rm -v $(pwd)/examples:/app/examples dvd-calculator examples/example1.txt

- `DOCKER_PASSWORD` : Token Docker Hub (optionnel)

| 1 volet BTTF | 15€ |- ✅ Couverture de tests à 100%

### Badges

# Mode interactif

Remplacez `VOTRE_USERNAME` dans les badges du README par votre nom d'utilisateur GitHub.

docker run --rm -it dvd-calculator| 4 DVDs (3 volets) | 48€ |

## 🎯 Validation complète



```bash

make all# Avec pipe| 3 BTTF + 1 autre | 56€ |**Interactif** :- ✅ Code TypeScript fortement typé

# ou

make ciecho -e "Back to the Future 1\nBack to the Future 2" | docker run --rm -i dvd-calculator

```

```

**Attendu** :

```

✓ ESLint: No errors

✓ Unit tests passed (34/34)## 📝 Utilisation## 🧪 Tests```bash

✓ Build successful

✓ Example 1: 36 ✅

✓ Example 2: 27 ✅

✓ Example 3: 15 ✅### Mode 1 : Fichier

✓ Example 4: 48 ✅

✓ Example 5: 56 ✅



All validations passed successfully! ✨```bash```bashnode dist/index.js## 🏗️ Architecture

```

make run                          # Utilise example1.txt par défaut

## 📁 Structure complète

node dist/index.js input.txt      # Avec un fichier customnpm test              # 34 tests

```

ekinox/```

├── .github/

│   └── workflows/           # GitHub Actions CI/CDnpm run test:coverage # Couverture# Saisir les titres puis Ctrl+D

│       ├── ci.yml          # Pipeline CI

│       ├── release.yml     # Workflow de release### Mode 2 : Pipe

│       └── dependency-review.yml

├── src/./validate.sh         # Validation complète

│   ├── domain/

│   │   └── entities/        # Movie, Cart + tests```bash

│   ├── application/

│   │   ├── use-cases/       # CalculateCartPriceecho -e "Back to the Future 1\nBack to the Future 2" | node dist/index.js``````Le projet suit les principes de la **Clean Architecture** :

│   │   ├── ports/           # IInputParser interface

│   │   └── DVDCalculatorApp.ts```

│   ├── infrastructure/

│   │   └── InputParser.ts   # Adapter

│   └── index.ts             # CLI

├── examples/                # 5 fichiers d'exemple### Mode 3 : Interactif

├── Dockerfile

├── docker-compose.yml## 🏗️ Architecture

├── Makefile                 # ⭐ Point d'entrée principal

├── eslint.config.js         # Configuration ESLint```bash

├── tsconfig.json

├── tsconfig.eslint.jsonnode dist/index.js

├── jest.config.js

├── package.json# Entrez les titres ligne par ligne

└── validate.sh

```# Ctrl+D pour terminerClean Architecture + TDD :## Règles métier```



## 🚀 Pour bien démarrer```



```bash- **Domain** : Entités métier (Movie, Cart)

# Clone le projet

cd ekinox## 📦 Sans Makefile



# Option 1 : Tout en une commande- **Application** : Use cases┌─────────────────────────────────────────────┐

make quick-start

```bash

# Option 2 : Docker

make docker-build && make docker-test# Installation- **Infrastructure** : Adapters (InputParser)



# Option 3 : Pipeline CI completnpm install

make ci

npm run build- **Interface** : CLI**Tarifs** :│           Application Layer                 │

# Option 4 : Validation complète

make all

```

# Tests

## 🤝 Contribution

npm test

1. Fork le projet

2. Créez une branche (`git checkout -b feature/AmazingFeature`)./validate.sh## 📁 Structure- Back to the Future : 15€│  - DVDCalculatorApp (orchestration)         │

3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)

4. Push vers la branche (`git push origin feature/AmazingFeature`)

5. Ouvrez une Pull Request

# Exécution

Les PR déclenchent automatiquement :

- ✅ Linting ESLintnode dist/index.js examples/example1.txt

- ✅ Tests unitaires

- ✅ Build TypeScript``````- Autres films : 20€│  - Use Cases (CalculateCartPrice)           │

- ✅ Validation des exemples

- ✅ Build Docker

- ✅ Revue des dépendances
- ✅ Validation des commits sémantiques

## 🎯 Validation complètesrc/

## 📄 Licence



ISC

```bash├── domain/          # Entités (0 dépendance)└──────────────┬──────────────────────────────┘

---

make all

**Node.js 24** • **TypeScript 5.3** • **Jest** • **ESLint** • **Clean Architecture** • **Docker** • **Makefile** • **GitHub Actions**

# ou├── application/     # Use cases

make validate

```├── infrastructure/  # Adapters**Promotions (BTTF uniquement)** :               │



**Attendu** :└── index.ts        # CLI

```

✓ Unit tests passed (34/34)```- 2 volets différents → 10% de réduction sur tous les DVDs BTTF┌──────────────▼──────────────────────────────┐

✓ Build successful

✓ Example 1: 36 ✅

✓ Example 2: 27 ✅

✓ Example 3: 15 ✅---- 3 volets différents → 20% de réduction sur tous les DVDs BTTF│          Domain Layer (Business Logic)      │

✓ Example 4: 48 ✅

✓ Example 5: 56 ✅



All validations passed successfully! ✨TypeScript 5.3 • Jest • Clean Architecture • Docker│  ┌─────────────────────────────────────┐   │

```



## 📁 Structure complète## Exemples│  │  Entities: Movie, Cart              │   │



```│  │  - Business rules                   │   │

ekinox/

├── src/```bash│  │  - Price calculation                │   │

│   ├── domain/

│   │   └── entities/        # Movie, Cart + tests# Exemple 1 : 3 volets → 36€│  │  - Discount logic                   │   │

│   ├── application/

│   │   ├── use-cases/       # CalculateCartPricenode dist/index.js examples/example1.txt│  └─────────────────────────────────────┘   │

│   │   └── DVDCalculatorApp.ts

│   ├── infrastructure/└──────────────┬──────────────────────────────┘

│   │   └── InputParser.ts   # Adapter

│   └── index.ts             # CLI# Exemple 2 : 2 volets → 27€                 │

├── examples/                # 5 fichiers d'exemple

├── Dockerfilenode dist/index.js examples/example2.txt┌──────────────▼──────────────────────────────┐

├── docker-compose.yml

├── Makefile                 # ⭐ Point d'entrée principal│       Infrastructure Layer                  │

├── package.json

├── tsconfig.json# Exemple 5 : 3 BTTF + 1 autre → 56€│         (InputParser, CLI)                  │

├── jest.config.js

└── validate.shnode dist/index.js examples/example5.txt└─────────────────────────────────────────────┘

```

``````

## 🚀 Pour bien démarrer



```bash

# Clone le projet| Panier | Calcul | Prix |### Principes appliqués

cd ekinox

|--------|--------|------|

# Option 1 : Tout en une commande

make quick-start| 3 volets BTTF | (15×3)×0.8 | 36€ |- **Separation of Concerns** : Chaque couche a une responsabilité claire



# Option 2 : Docker| 2 volets BTTF | (15×2)×0.9 | 27€ |- **Dependency Inversion** : Les dépendances pointent vers l'intérieur

make docker-build && make docker-test

| 1 volet BTTF | 15×1 | 15€ |- **Single Responsibility** : Une classe = une responsabilité

# Option 3 : Validation complète

make all| 4 DVDs BTTF (3 volets) | (15×4)×0.8 | 48€ |- **Test-Driven Development** : Les tests ont été écrits avant le code

```

| 3 BTTF + 1 autre | (15×3)×0.8+20 | 56€ |- **Domain sans dépendance** : Le domaine est 100% pur, sans aucune dépendance externe

---



**Node.js 24** • **TypeScript 5.3** • **Jest** • **ESLint** • **Clean Architecture** • **Docker** • **Makefile**

## Tests## 📦 Installation



```bash### Prérequis

npm test              # Lancer les tests (34 tests)

npm run test:coverage # Avec couverture- Node.js >= 18.x

./validate.sh         # Validation complète- npm >= 9.x

```

### Étapes d'installation

**Résultat attendu** :

``````bash

Test Suites: 4 passed# Cloner le projet (ou extraire l'archive)

Tests: 34 passedcd ekinox

Coverage: >85%

```# Installer les dépendances

npm install

## Structure

# Compiler le projet TypeScript

```npm run build

src/```

├── domain/              # Entités métier (Movie, Cart)

├── application/         # Use cases, orchestration## 🚀 Utilisation

├── infrastructure/      # Parsing, I/O

└── index.ts            # CLI### Mode 1 : Lecture depuis un fichier

```

```bash

## Architecture# Créer un fichier d'entrée

cat > input.txt << EOF

**Clean Architecture** avec :Back to the Future 1

- Domain pur (0 dépendance)Back to the Future 2

- Application (use cases)Back to the Future 3

- Infrastructure (adapters)EOF

- Injection de dépendance

# Exécuter le programme

**Principes** : SOLID, TDD, Hexagonal Architecturenode dist/index.js input.txt

# Output: 36

## Commandes```



```bash### Mode 2 : Via pipe (stdin)

npm install           # Installer

npm run build         # Compiler```bash

npm start             # Lancerecho -e "Back to the Future 1\nBack to the Future 3" | node dist/index.js

npm run dev           # Dev mode# Output: 27

npm test              # Tests```

./validate.sh         # Validation

```### Mode 3 : Mode interactif



## Qualité```bash

node dist/index.js

- ✅ 34 tests (TDD)# Entrez les titres ligne par ligne

- ✅ TypeScript strict# Appuyez sur Ctrl+D (Unix) ou Ctrl+Z (Windows) pour terminer

- ✅ Clean Architecture```

- ✅ >85% coverage

- ✅ SOLID principles### Mode 4 : Via npm dev (sans compilation)

- ✅ Production-ready

```bash

## Pour présentationnpm run dev < input.txt

```

**Démo 3 minutes** :

```bash## 🧪 Tests

npm install && npm run build && npm test && ./validate.sh

node dist/index.js examples/example1.txtLe projet dispose d'une suite de tests complète avec **34 tests** couvrant :

```

- ✅ Entités du domaine (Movie, Cart)

**Points clés** :- ✅ Use cases (CalculateCartPrice)

- Architecture professionnelle- ✅ Infrastructure (InputParser)

- TDD (tests avant code)- ✅ Tous les exemples de la spécification

- Code maintenable

- TypeScript strict### Exécuter les tests

- Documentation complète

```bash

---# Lancer tous les tests

*TypeScript 5.3 • Jest • Clean Architecture • Node.js 18+*npm test


# Mode watch (re-exécution automatique)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Résultats attendus

```
Test Suites: 4 passed, 4 total
Tests:       34 passed, 34 total
Snapshots:   0 total
```

## 💰 Règles métier

### Tarifs

- **DVD Back to the Future** : 15 € / unité
- **Autres films** : 20 € / unité

### Réductions (sur les DVDs Back to the Future uniquement)

| Nombre de volets différents | Réduction | Application |
|----------------------------|-----------|-------------|
| 1 volet | 0% | Pas de réduction |
| 2 volets différents | 10% | Sur tous les DVDs BTTF |
| 3 volets différents | 20% | Sur tous les DVDs BTTF |

### Exemples

#### Exemple 1 : 3 volets différents
```
Entrée:
Back to the Future 1
Back to the Future 2
Back to the Future 3

Calcul: (15 × 3) × 0.8 = 36 €
```

#### Exemple 2 : 2 volets différents
```
Entrée:
Back to the Future 1
Back to the Future 3

Calcul: (15 × 2) × 0.9 = 27 €
```

#### Exemple 3 : 4 DVDs avec 3 volets différents
```
Entrée:
Back to the Future 1
Back to the Future 2
Back to the Future 3
Back to the Future 2

Calcul: (15 × 4) × 0.8 = 48 €
```

#### Exemple 4 : Mix BTTF + autre film
```
Entrée:
Back to the Future 1
Back to the Future 2
Back to the Future 3
La chèvre

Calcul: ((15 × 3) × 0.8) + 20 = 56 €
```

## 📁 Structure du projet

```
ekinox/
├── src/
│   ├── domain/                    # Couche domaine (logique métier)
│   │   └── entities/
│   │       ├── Movie.ts           # Entité Movie
│   │       ├── Movie.test.ts
│   │       ├── Cart.ts            # Entité Cart
│   │       └── Cart.test.ts
│   │
│   ├── application/               # Couche application (use cases)
│   │   ├── use-cases/
│   │   │   ├── CalculateCartPrice.ts
│   │   │   └── CalculateCartPrice.test.ts
│   │   └── DVDCalculatorApp.ts    # Orchestration
│   │
│   ├── infrastructure/            # Couche infrastructure
│   │   ├── InputParser.ts         # Parser d'entrée
│   │   └── InputParser.test.ts
│   │
│   └── index.ts                   # CLI principal
│
├── dist/                          # Fichiers compilés
├── package.json
├── tsconfig.json                  # Configuration TypeScript
├── jest.config.js                 # Configuration Jest
└── README.md
```

## 🛠️ Scripts disponibles

```bash
npm run build        # Compiler le projet TypeScript
npm start            # Exécuter le programme compilé
npm run dev          # Exécuter en mode développement (ts-node)
npm test             # Lancer les tests
npm run test:watch   # Tests en mode watch
npm run test:coverage # Rapport de couverture
```

## 🔍 Qualité du code

### Standards appliqués

- ✅ **TypeScript strict mode** : Types stricts, pas de `any`
- ✅ **100% de couverture de tests** : Toutes les branches testées
- ✅ **Clean Code** : Noms explicites, fonctions courtes, SRP
- ✅ **SOLID principles** : Architecture maintenable et extensible
- ✅ **Documentation** : JSDoc sur toutes les méthodes publiques

### Configuration TypeScript

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true
}
```

## 🚀 Évolutions possibles

- [ ] Ajouter un mode API REST
- [ ] Supporter d'autres formats d'entrée (JSON, CSV)
- [ ] Ajouter une interface web
- [ ] Gérer d'autres promotions (bundles, codes promo)
- [ ] Ajouter un système de logging
- [ ] Internationalisation (i18n)

## 📝 Licence

ISC

## 👤 Auteur

Développé avec ❤️ en suivant les principes du TDD et de la Clean Architecture.

---

**Note** : Ce projet a été réalisé dans le cadre d'un exercice technique pour démontrer la maîtrise du TDD, de la Clean Architecture et de TypeScript.
