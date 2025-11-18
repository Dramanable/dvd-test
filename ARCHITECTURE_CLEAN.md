# Architecture Clean - DVD Calculator

## Vue d'ensemble

Ce projet suit les principes de **Clean Architecture** avec une séparation stricte des couches et le principe d'inversion de dépendances (Dependency Inversion Principle).

## Structure des couches

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION                          │
│  (CLI, API REST, SDK - Orchestration uniquement)       │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   CLI    │  │ REST API │  │   SDK    │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
└───────┼─────────────┼─────────────┼──────────────────┘
        │             │             │
        │ Inject      │ Inject      │ Inject
        │ adapters    │ adapters    │ adapters
        ▼             ▼             ▼
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION                           │
│  (Use Cases, Services, Ports/Interfaces)               │
│                                                         │
│  ┌───────────────────────────────────────────┐        │
│  │     DVDCalculatorService                  │        │
│  │  (Orchestrates domain use cases)          │        │
│  └────────────┬──────────────────────────────┘        │
│               │ depends on                             │
│               ▼                                        │
│  ┌───────────────────────┬─────────────────────┐     │
│  │   IInputParser Port   │   ICache Port       │     │
│  │  (Abstraction)        │  (Abstraction)      │     │
│  └───────────────────────┴─────────────────────┘     │
└─────────────────────────────────────────────────────────┘
                        ▲
                        │ implements
                        │
┌─────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE                         │
│  (Adapters - Implémentations concrètes)                │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ InputParser  │  │ArrayInput    │                   │
│  │ (Text input) │  │Parser        │                   │
│  │              │  │(Array input) │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ RedisCache   │  │ InMemoryCache│                   │
│  │ (Production) │  │ (Testing)    │                   │
│  └──────────────┘  └──────────────┘                   │
└─────────────────────────────────────────────────────────┘
                        ▲
                        │ uses
                        │
┌─────────────────────────────────────────────────────────┐
│                     DOMAIN                              │
│  (Entities, Business Logic - 0 dependencies)           │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │   Movie      │  │    Cart      │                   │
│  │  (Entity)    │  │  (Entity)    │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                         │
│  ┌─────────────────────────────────────┐              │
│  │  Business Rules (Discounts, etc.)   │              │
│  └─────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

## Flux de dépendances

**Règle d'or** : Les dépendances pointent toujours **vers l'intérieur** (vers le domaine).

```
Presentation → Application → Infrastructure → Domain
     ↓              ↓              ↓
  Injecte      Dépend de      Implémente
  adapters       ports          ports
```

## Cas d'usage par interface

### 1. CLI (Command Line Interface)

```typescript
// Presentation Layer
const inputParser = new InputParser();  // Text-based parser
const cache = new InMemoryCache();
const service = new DVDCalculatorService(inputParser, cache);

const input = `
Back to the future 1
Back to the future 2
Star Wars 4
`;

const total = service.run(input);  // Returns 62
```

**Flux** :
1. CLI injecte `InputParser` (texte → array) dans `DVDCalculatorService`
2. Service parse avec `inputParser.parse(input)` → `['Back to the future 1', ...]`
3. Service calcule le prix total via le domaine
4. Retourne le résultat

### 2. API REST

```typescript
// Presentation Layer
const movies = ['Back to the future 1', 'Back to the future 2', 'Star Wars 4'];

const inputParser = new ArrayInputParser(movies);  // Array-based parser
const cache = request.server.cache;  // RedisCache from Fastify
const service = new DVDCalculatorService(inputParser, cache);

const total = service.run('');  // Input ignored, array in parser
```

**Flux** :
1. API reçoit JSON : `{ "movies": [...] }`
2. API injecte `ArrayInputParser` (array déjà parsé) dans `DVDCalculatorService`
3. Service parse avec `inputParser.parse('')` → retourne l'array directement
4. Service calcule et met en cache
5. API formate la réponse REST

### 3. SDK (Library for External Users)

```typescript
// Presentation Layer (Facade)
const calculator = new DVDCalculator();

const result = calculator
  .addMovie('Back to the future 1')
  .addMovie('Star Wars 4')
  .calculate();

console.log(result.total);  // 32
```

**Flux** :
1. SDK expose une API fluide simple
2. SDK utilise directement les entités du domaine
3. Pas de dépendance vers API ou CLI (tous dans la couche présentation)

## Principe d'inversion de dépendances (DIP)

### Ports (Application Layer)

Les **ports** sont des **abstractions** (interfaces) définies dans la couche application :

#### `IInputParser`
```typescript
export interface IInputParser {
  parse(input: string): string[];
}
```

#### `ICache`
```typescript
export interface ICache {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  get(key: string): Promise<any>;
  set(key: string, value: any, expiry?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
  getStats(): CacheStats;
  ping(): Promise<boolean>;
  resetStats(): void;
}
```

### Adapters (Infrastructure Layer)

Les **adapters** sont des **implémentations concrètes** des ports :

#### Input Adapters
- **`InputParser`** : Pour le CLI (texte multiligne → array)
- **`ArrayInputParser`** : Pour l'API REST (array déjà parsé → array)

#### Cache Adapters
- **`RedisCache`** : Pour la production (Redis externe)
- **`InMemoryCache`** : Pour les tests (Map en mémoire)

### Pourquoi ArrayInputParser ?

**Problème** : L'API REST reçoit déjà un array depuis le JSON, mais `DVDCalculatorService` attend un `IInputParser` (conçu pour le CLI avec texte).

**Solution** : Créer un adapter qui implémente `IInputParser` mais prend l'array en constructeur :

```typescript
export class ArrayInputParser implements IInputParser {
  private movies: string[];

  constructor(movies: string[]) {
    this.movies = movies;
  }

  parse(_input: string): string[] {
    return this.movies
      .filter((movie) => movie && movie.trim().length > 0)
      .map((movie) => movie.trim());
  }
}
```

**Avantages** :
- ✅ Respecte le DIP : `DVDCalculatorService` dépend de `IInputParser` (abstraction)
- ✅ Réutilisable : Le service fonctionne pour CLI et API
- ✅ Testable : On peut facilement mocker `IInputParser`
- ✅ Flexible : On peut ajouter d'autres sources (fichier, DB, etc.)

## Tests

### Structure des tests

```
src/
├── application/
│   ├── services/__tests__/
│   │   └── DVDCalculatorService.test.ts (20 tests)
│   └── use-cases/__tests__/
│       └── CalculateCartPrice.test.ts (10 tests)
├── infrastructure/
│   └── adapters/__tests__/
│       ├── InputParser.test.ts (10 tests)
│       ├── ArrayInputParser.test.ts (10 tests)
│       ├── RedisCache.test.ts (20 tests)
│       └── InMemoryCache.test.ts (20 tests)
├── domain/
│   ├── entities/__tests__/
│   │   ├── Cart.test.ts (32 tests)
│   │   └── Movie.test.ts (32 tests)
│   └── exceptions/__tests__/
│       ├── DomainException.test.ts (4 tests)
│       └── ValidationException.test.ts (4 tests)
└── presentation/
    ├── api/__tests__/
    │   └── routes.test.ts (12 tests)
    └── sdk/__tests__/
        └── DVDCalculator.test.ts (26 tests)

Total : 174 tests ✅
```

### Coverage des adapters

#### ArrayInputParser (10 tests)
- ✅ Valid array parsing
- ✅ Empty strings filtering
- ✅ Whitespace trimming
- ✅ Empty array handling
- ✅ Whitespace-only strings
- ✅ Case preservation
- ✅ Special characters
- ✅ Duplicates handling
- ✅ Interface compliance

#### InputParser (10 tests)
- ✅ Text splitting by newline
- ✅ Empty line filtering
- ✅ Whitespace trimming
- ✅ Interface compliance

## Avantages de cette architecture

### 1. Séparation des préoccupations
- **Domain** : Logique métier pure (Movie, Cart, discounts)
- **Application** : Orchestration (use cases, services)
- **Infrastructure** : Détails techniques (Redis, parsing)
- **Presentation** : Interfaces utilisateur (CLI, REST, SDK)

### 2. Testabilité
- Chaque couche est testable indépendamment
- Les mocks sont faciles grâce aux interfaces
- Coverage à 100% possible

### 3. Flexibilité
- Changer Redis → Memcached : Créer `MemcachedCache implements ICache`
- Ajouter GraphQL : Nouvelle couche présentation, même application
- Ajouter parsing XML : Créer `XmlInputParser implements IInputParser`

### 4. Maintenabilité
- Couplage faible entre les couches
- Modification d'une couche n'impacte pas les autres
- Code self-documented par les interfaces

## Règles à respecter

### ❌ Violations interdites

1. **Présentation → Présentation**
   ```typescript
   // ❌ API ne doit PAS dépendre du SDK
   import { DVDCalculator } from '../sdk';
   ```

2. **Logique métier dans la présentation**
   ```typescript
   // ❌ Parsing/calcul dans l'API
   function parseMovie(title: string) { ... }
   ```

3. **Dépendances vers l'extérieur**
   ```typescript
   // ❌ Application dépend de Redis directement
   import { RedisCache } from '../../infrastructure';
   ```

### ✅ Bonnes pratiques

1. **Injection de dépendances**
   ```typescript
   // ✅ Injecter les adapters dans le service
   const service = new DVDCalculatorService(inputParser, cache);
   ```

2. **Dépendre des abstractions**
   ```typescript
   // ✅ Service dépend de ICache, pas RedisCache
   constructor(parser: IInputParser, cache?: ICache)
   ```

3. **Présentation orchestrate seulement**
   ```typescript
   // ✅ API formate seulement, pas de logique métier
   const total = service.run('');
   return { total, ... };  // Formatting only
   ```

## Commandes

```bash
# Build
npm run build

# Tests
npm test

# Lint
npm run lint

# Coverage
npm run test:coverage

# CLI
npm start

# API (dev)
npm run dev

# API (prod)
npm run start:api
```

## Conclusion

Cette architecture garantit :
- ✅ **Clean Architecture** : Séparation stricte des couches
- ✅ **DIP** : Dépendance vers les abstractions, pas les implémentations
- ✅ **Testabilité** : 174 tests passent, coverage élevé
- ✅ **Maintenabilité** : Code modulaire et découplé
- ✅ **Flexibilité** : Facile d'ajouter de nouvelles interfaces ou adapters
