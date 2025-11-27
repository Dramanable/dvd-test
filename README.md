# DVD Calculator - Clean Architecture

<!-- Badges dynamiques générés par ./scripts/generate-badges.sh -->
![CI](https://github.com/Dramanable/dvd-test/workflows/CI/badge.svg)
![Tests](https://img.shields.io/badge/tests-229%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-74.12%25-brightgreen)
![Node](https://img.shields.io/badge/node-24.x-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.3-blue)
![License](https://img.shields.io/badge/license-ISC-blue)
![License](https://img.shields.io/badge/license-ISC-blue)
![License](https://img.shields.io/badge/license-ISC-blue)
![License](https://img.shields.io/badge/license-ISC-blue)

Calculateur de prix pour boutique de DVD avec promotions sur la saga "Back to the Future".

**Architecture Clean avec Dependency Inversion** : 0 logique métier dans la présentation.

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture Clean détaillée avec diagrammes
- **[API.md](./API.md)** - Documentation de l'API REST avec cache Redis
- **[SDK.md](./SDK.md)** - Guide d'utilisation du SDK
- **[docs/DYNAMIC_STATS.md](./docs/DYNAMIC_STATS.md)** - Système de statistiques dynamiques
- **[DOCKER.md](./DOCKER.md)** - Déploiement avec Docker et Docker Compose
- **[CHANGELOG.md](./CHANGELOG.md)** - Historique des versions

## 🚀 Démarrage rapide

```bash
# Installation complète + build + tests
npm install
npm run build
npm test

# Validation complète (lint + build + tests + exemples)
./validate.sh

# Avec Docker
docker build -t dvd-calculator .
docker run --rm dvd-calculator examples/example1.txt
```

## 💰 Règles métier

**Tarifs** :
- Back to the Future : 15€
- Autres films : 20€

**Promotions (BTTF uniquement)** :
- 2 volets différents → 10% de réduction sur tous les DVDs BTTF
- 3 volets différents → 20% de réduction sur tous les DVDs BTTF

## 📊 Exemples

| Panier | Calcul | Résultat |
|--------|--------|----------|
| 3 volets BTTF | (15×3)×0.8 | **36€** |
| 2 volets BTTF | (15×2)×0.9 | **27€** |
| 1 volet BTTF | 15×1 | **15€** |
| 4 DVDs (3 volets) | (15×4)×0.8 | **48€** |
| 3 BTTF + 1 autre | (15×3)×0.8+20 | **56€** |

## 🏗️ Architecture (Résumé)

**Clean Architecture** avec séparation stricte des couches :

```
Presentation (CLI/API/SDK)
    ↓ injecte adapters
Application (DVDCalculatorService + Ports)
    ↓ dépend de
Infrastructure (Adapters: InputParser, Cache)
    ↓ utilise
Domain (Movie, Cart - 0 dépendance)
```

**Principes appliqués** :
- ✅ **Dependency Inversion Principle** - Les dépendances pointent vers les abstractions
- ✅ **Zero business logic in presentation** - Uniquement orchestration
- ✅ **Single Responsibility Principle** - Une classe = une responsabilité
- ✅ **Test-Driven Development** - 229 tests avec couverture >74%

**Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour les détails complets.**

## 📝 Utilisation

### Mode CLI

```bash
# Fichier d'entrée
node dist/cli.js examples/example1.txt

# Pipe
echo -e "Back to the Future 1\nBack to the Future 2" | node dist/cli.js

# Mode interactif
node dist/cli.js
```

### Mode API REST

```bash
npm start

curl -X POST http://localhost:3000/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{"movies": ["Back to the Future 1", "Back to the Future 2"]}'
```

**Documentation interactive** : http://localhost:3000/api/docs

### Mode SDK

```typescript
import { DVDCalculator } from '@ekinox/dvd-calculator';

const calculator = new DVDCalculator();
calculator
  .addMovie('Back to the Future 1')
  .addMovie('Back to the Future 2');

const total = calculator.getTotal(); // 27€
```

**Voir [SDK.md](./SDK.md) pour toutes les fonctionnalités.**

## 🧪 Tests

**229 tests** avec couverture >74% :

```bash
npm test              # Tous les tests
npm run test:coverage # Avec couverture
npm run test:watch    # Mode watch
./validate.sh         # Validation complète
```

### 📊 Statistiques Dynamiques

Les badges et statistiques de ce README sont **automatiquement mis à jour** :

```bash
# Générer les badges avec les vraies statistiques
./scripts/generate-badges.sh

# Mettre à jour toute la documentation
./scripts/update-docs-stats.sh  

# Intégration continue complète (tests + stats + commit)
./scripts/ci-update-stats.sh
```

> **Note** : Les statistiques sont extraites en temps réel depuis `npm test` et `npm run test:coverage`.

**Distribution** :
- Domain : 229 tests (Movie, Cart)
- Application : 229 tests (Services, Use Cases)
- Infrastructure : 229 tests (Adapters)
- Presentation : 229 tests (CLI, API, SDK, E2E)

**E2E Tests** :
- API E2E : 229 tests (endpoints, CORS, performance)
- SDK E2E : 229 tests (calculate, fluent API, scénarios réels)

## 🐳 Docker

```bash
# Build
docker build -t dvd-calculator .

# CLI avec fichier
docker run --rm -v $(pwd)/examples:/app/examples dvd-calculator examples/example1.txt

# CLI mode interactif
docker run --rm -it dvd-calculator

# CLI avec pipe
echo -e "Back to the Future 1\nBack to the Future 2" | docker run --rm -i dvd-calculator

# API REST
docker build -f Dockerfile.api -t dvd-calculator-api .
docker run --rm -p 3000:3000 dvd-calculator-api
```

**Voir [DOCKER.md](./DOCKER.md) pour Docker Compose et production.**

## 🎯 Points forts

### Architecture
- ✅ **Clean Architecture** stricte avec 4 couches
- ✅ **Dependency Inversion** - Ports & Adapters pattern
- ✅ **No business logic in presentation** - 100% respecté
- ✅ **Domain pur** - 0 dépendance externe

### Qualité
- ✅ **229 tests** - TDD from start  
- ✅ **74.12% coverage** - Tous les chemins testés
- ✅ **TypeScript strict** - Pas de \`any\`
- ✅ **ESLint** - Code style cohérent

### Flexibilité
- ✅ **3 interfaces** - CLI, API REST, SDK
- ✅ **Multiple adapters** - InputParser, ArrayInputParser, Cache
- ✅ **Facilement extensible** - Ajouter GraphQL, gRPC, etc.

## 📁 Structure

```
src/
├── core/                # Couche métier centrale
│   ├── domain/          # Entités métier (0 dépendance)
│   │   └── entities/    # Movie, Cart
│   └── application/     # Use Cases + Ports
│       ├── services/    # DVDCalculatorService
│       ├── use-cases/   # CalculateCartPrice
│       └── ports/       # IInputParser, ICache
├── infrastructure/      # Adapters
│   └── adapters/        # InputParser, ArrayInputParser, Cache
└── presentation/        # Interfaces utilisateur
    ├── cli/             # Mode ligne de commande
    ├── api/             # API REST Fastify
    └── sdk/             # Bibliothèque SDK
```

## 🤝 Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les détails.

**Commits sémantiques** (Conventional Commits) :

```bash
git commit -m "feat(cart): ajouter support multi-devises"
```

## 🔄 GitHub Actions CI/CD

Le projet utilise GitHub Actions pour l'intégration continue :

- ✅ **CI** : Lint + Build + Tests + Docker (sur push/PR)
- ✅ **Release** : Publication automatique (sur tag v*)
- ✅ **Dependency Review** : Audit de sécurité (sur PR)

## 📄 Licence

ISC

---

**Node.js 24** • **TypeScript 5.3** • **Jest** • **ESLint** • **Clean Architecture** • **Docker** • **Fastify**
