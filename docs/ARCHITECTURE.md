# Architecture du Projet - DVD Calculator

## 📐 Clean Architecture + Présentation

Le projet suit une **Clean Architecture stricte** avec 4 couches + 1 couche de présentation :

```
┌─────────────────────────────────────────────────┐
│         PRESENTATION LAYER (UI/API/SDK)         │
│  ┌─────────┬─────────────┬──────────────────┐  │
│  │   CLI   │   REST API  │       SDK        │  │
│  │ (index) │  (Fastify)  │  (TypeScript)    │  │
│  └─────────┴─────────────┴──────────────────┘  │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│        INFRASTRUCTURE LAYER (Adapters)          │
│  • InputParser (IInputParser implementation)    │
│  • RedisCache (Cache implementation)            │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│        APPLICATION LAYER (Use Cases)            │
│  • CalculateCartPrice (business logic)          │
│  • DVDCalculatorApp (orchestration)             │
│  • Ports (IInputParser interface)               │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│           DOMAIN LAYER (Entities)               │
│  • Movie (value object)                         │
│  • Cart (aggregate)                             │
│  • Exceptions (domain errors)                   │
│  NO DEPENDENCIES - Pure business logic          │
└─────────────────────────────────────────────────┘
```

## 📁 Structure des Dossiers

```
src/
├── domain/                    # Couche Domaine (0 dépendances)
│   ├── entities/
│   │   ├── Movie.ts           # Entité Movie (valeur)
│   │   ├── Cart.ts            # Agrégat Cart
│   │   └── __tests__/
│   └── exceptions/
│       ├── DomainException.ts
│       ├── ValidationException.ts
│       └── __tests__/
│
├── application/               # Couche Application (use cases)
│   ├── ports/
│   │   └── IInputParser.ts    # Interface (Dependency Inversion)
│   ├── use-cases/
│   │   ├── CalculateCartPrice.ts
│   │   └── __tests__/
│   └── DVDCalculatorApp.ts    # Application orchestrator
│
├── infrastructure/            # Couche Infrastructure (implémentations)
│   ├── InputParser.ts         # Implémente IInputParser
│   ├── RedisCache.ts          # Cache Redis
│   └── __tests__/
│
├── types/                     # Types TypeScript globaux
│   └── fastify.d.ts           # Extension Fastify
│
└── presentation/              # Couche Présentation (3 interfaces)
    ├── sdk/                   # SDK TypeScript/JavaScript
    │   ├── DVDCalculator.ts   # Classe principale SDK
    │   ├── index.ts           # Export public
    │   └── __tests__/
    │
    ├── cli/                   # Interface ligne de commande
    │   └── index.ts           # Entrée CLI
    │
    └── api/                   # API REST (Fastify)
        ├── server.ts          # Configuration serveur
        ├── routes.ts          # Routes legacy + orchestration
        ├── swagger.ts         # Documentation OpenAPI
        ├── index.ts           # Entrée API
        ├── v1/
        │   └── routes.ts      # Routes API v1 (détaillées)
        ├── v2/
        │   └── routes.ts      # Routes API v2 (simplifiées)
        └── __tests__/
```

## 🎯 Principes Respectés

### 1. **Dependency Rule (Règle de dépendance)**
```
Presentation → Infrastructure → Application → Domain
                                                  ↑
                                            0 dépendances
```

- **Domain** : Aucune dépendance externe
- **Application** : Dépend uniquement du Domain
- **Infrastructure** : Implémente les Ports de l'Application
- **Presentation** : Utilise toutes les couches inférieures

### 2. **Dependency Inversion Principle**
```
Application → IInputParser (interface)
                  ↑
Infrastructure → InputParser (implémentation)
```

L'Application dépend d'une **abstraction** (IInputParser), pas d'une implémentation concrète.

### 3. **Single Responsibility**
- **SDK** : Interface programmatique pour développeurs
- **CLI** : Interface ligne de commande pour utilisateurs
- **API** : Interface HTTP REST pour clients web/mobile

### 4. **API Versioning**
```
/api/calculate      → Legacy (redirects to v1)
/v1/calculate       → Version 1 (full details)
/v2/calculate       → Version 2 (simplified)
/v1/health          → Health check v1
/v2/health          → Health check v2
```

## 🔄 Flux de Données

### CLI Flow
```
User Input → CLI → DVDCalculatorApp → CalculateCartPrice → Cart → Movie
                ↓
          InputParser (Infrastructure)
```

### API Flow
```
HTTP Request → Fastify → Routes → DVDCalculator (SDK) → Cart → Movie
                         ↓
                   RedisCache (Infrastructure)
```

### SDK Flow
```
Code → DVDCalculator → CalculateCartPrice → Cart → Movie
```

## 📦 Modules NPM Exportés

Le package expose 3 points d'entrée :

### 1. SDK (défaut)
```typescript
import { DVDCalculator } from 'dvd-shop-calculator';
```

### 2. CLI
```bash
npx dvd-calculator movies.txt
```

### 3. API
```typescript
import { startServer } from 'dvd-shop-calculator/api';
```

## 🧪 Tests

- **122 tests** au total
- **86.18%** de couverture globale
- **100%** de couverture sur le domaine
- **TDD** : Tests écrits avant le code

## 🏗️ Avantages de cette Architecture

### ✅ Testabilité
- Domain testé isolément (0 dépendances)
- Mocks faciles via interfaces (IInputParser)
- Tests unitaires rapides

### ✅ Maintenabilité
- Séparation claire des responsabilités
- Changements localisés (ex: changer Redis → MemoryCache)
- Code auto-documenté

### ✅ Évolutivité
- Nouvelles interfaces (GraphQL, gRPC) sans toucher au domaine
- Nouvelles versions d'API (/v3) faciles à ajouter
- SDK réutilisable dans d'autres projets

### ✅ Indépendance
- Domain indépendant de toute technologie
- Peut migrer de Fastify → Express sans toucher au métier
- Peut changer de cache sans toucher aux use cases

## 🔐 Sécurité & Production

- **Helmet** : Headers de sécurité (XSS, CSRF, CSP)
- **Rate Limiting** : 100 req/min avec ban après 5 violations
- **Compression** : gzip/brotli (threshold 1KB)
- **Redis Cache** : Cache intelligent avec hit/miss stats
- **Health Check** : `/health` avec memory, version, dependencies
- **Metrics** : `/metrics` avec CPU, memory, HTTP, cache stats

## 📊 Versioning d'API

### v1 (Détaillée)
```json
{
  "total": 15.2,
  "subtotal": 16,
  "discount": 0.8,
  "discountPercentage": 5,
  "itemCount": 2,
  "uniqueEpisodes": 2,
  "movies": [...]
}
```

### v2 (Simplifiée)
```json
{
  "total": 15.2,
  "itemCount": 2
}
```

## 🚀 Déploiement

### Docker Compose
```bash
docker-compose up
```

Services :
- **API** : http://localhost:5000
- **Redis** : localhost:6379
- **Docs** : http://localhost:5000/api/docs

### CI/CD
- **GitHub Actions** : Build, Test, Lint, Coverage, Docker Push
- **Security Scan** : npm audit
- **Docker Registry** : GHCR (GitHub Container Registry)

---

**Architecture complète, production-ready, et évolutive** 🎉
