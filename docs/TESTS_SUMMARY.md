# Tests Unitaires - Résumé

## ✅ État final : 164/164 tests passent (100%)

### 📊 Répartition des tests

| Module | Tests | Description |
|--------|-------|-------------|
| **Application Services** | 20 | DVDCalculatorService avec mocks |
| **Infrastructure** | 40 | InputParser (20) + RedisCache (20) |
| **Domain** | 46 | Cart (20) + Movie (16) + Exceptions (10) |
| **Presentation** | 58 | API (12) + SDK (26) + CLI (20) |
| **TOTAL** | **164** | **100% passent** ✅ |

---

## 🧪 Tests du DVDCalculatorService (20 tests)

**Fichier**: `src/application/services/__tests__/DVDCalculatorService.test.ts`

### Couverture complète

#### 1. **Constructor** (2 tests)
- ✅ Service avec InputParser uniquement
- ✅ Service avec InputParser + Cache

#### 2. **run()** (8 tests)
- ✅ 1 film BTTF : 15€ (pas de remise)
- ✅ 2 films BTTF : 27€ (10% de remise)
- ✅ 3 films BTTF : 36€ (20% de remise)
- ✅ 4 films BTTF (avec doublon) : 48€ (20% sur 3 épisodes uniques)
- ✅ Mix BTTF + autres : 47€ (BTTF remisés, autres à 20€)
- ✅ Entrée vide : 0€
- ✅ Lignes vides dans l'entrée
- ✅ Espaces autour des titres

#### 3. **runAndDisplay()** (1 test)
- ✅ Affichage console avec mock de console.log

#### 4. **Cache Management** (4 tests)
- ✅ getCache() retourne undefined sans cache
- ✅ getCache() retourne le cache injecté
- ✅ setCache() permet d'injecter un cache
- ✅ setCache() peut remplacer un cache existant

#### 5. **Integration with InputParser** (2 tests)
- ✅ Utilisation d'un parser custom (avec mock jest)
- ✅ Parser retournant un tableau vide

#### 6. **Error Handling** (2 tests)
- ✅ Titres inconnus traités comme films réguliers (20€)
- ✅ Parser qui lance une exception

#### 7. **Service Behavior** (2 tests)
- ✅ Stateless : appels multiples avec même entrée
- ✅ Calculs concurrents indépendants

---

## 🔌 Port ICache (application/ports/ICache.ts)

```typescript
export interface ICache {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
  getStats(): Promise<CacheStats>;
  ping(): Promise<boolean>;
  resetStats(): void;
}

export interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  hitRate: number;
}
```

### ✅ Avantages

1. **Abstraction** : Application ne dépend pas de Redis
2. **Testabilité** : MockCache implémente ICache
3. **Flexibilité** : Peut changer de cache sans toucher l'application
4. **DIP** : Dependency Inversion Principle respecté

---

## 🔧 Adapter RedisCache (infrastructure/RedisCache.ts)

**Fichier**: `src/infrastructure/RedisCache.ts`
**Tests**: `src/infrastructure/__tests__/RedisCache.test.ts` (20 tests)

### Implémentation

```typescript
export class RedisCache implements ICache {
  private client: Redis;
  private ttl: number;
  private stats = { hits: 0, misses: 0 };
  
  constructor(config: CacheConfig) { ... }
  
  // Implémente toutes les méthodes d'ICache
  async connect(): Promise<void> { ... }
  async get<T>(key: string): Promise<T | null> { ... }
  async set<T>(key: string, value: T, ttl?: number): Promise<void> { ... }
  // ... etc
}
```

### Tests RedisCache (20 tests)

#### 1. **Connection** (4 tests)
- ✅ Connexion réussie
- ✅ Déconnexion propre
- ✅ Gestion erreur de connexion
- ✅ Ping pour vérifier connectivité

#### 2. **GET Operations** (4 tests)
- ✅ GET avec valeur existante (cache hit)
- ✅ GET avec clé inexistante (cache miss)
- ✅ GET avec erreur Redis
- ✅ GET avec JSON invalide

#### 3. **SET Operations** (3 tests)
- ✅ SET d'une valeur simple
- ✅ SET d'un objet complexe
- ✅ SET avec erreur Redis

#### 4. **DELETE Operations** (2 tests)
- ✅ DEL d'une clé existante
- ✅ DEL avec erreur Redis

#### 5. **CLEAR Operations** (1 test)
- ✅ CLEAR de toutes les clés

#### 6. **Statistics** (4 tests)
- ✅ Stats après hits/misses
- ✅ Calcul du hit rate
- ✅ Reset des stats
- ✅ Stats avec erreur

#### 7. **TTL** (2 tests)
- ✅ TTL par défaut (3600s)
- ✅ TTL custom

---

## 🧱 MockCache pour tests

**Localisation**: Dans les tests du DVDCalculatorService

```typescript
class MockCache implements ICache {
  private store = new Map<string, string>();
  private stats = { hits: 0, misses: 0 };
  
  // Implémentation en mémoire pour les tests
  async get<T>(key: string): Promise<T | null> { ... }
  async set<T>(key: string, value: T): Promise<void> { ... }
  // ... etc
}
```

### ✅ Usage

- Utilisé dans les tests du service
- Pas besoin de Redis pour tester
- Rapide et isolé

---

## 📐 Architecture Clean respectée

### Flux de dépendances

```
┌─────────────────────────────────────────────┐
│          PRESENTATION LAYER                  │
│  (API, CLI, SDK)                             │
│  - Utilise DVDCalculatorService              │
│  - Injecte ICache si besoin                  │
└──────────────┬──────────────────────────────┘
               │ depends on
               ▼
┌─────────────────────────────────────────────┐
│          APPLICATION LAYER                   │
│  Services:                                   │
│  - DVDCalculatorService                      │
│                                              │
│  Ports (Interfaces):                         │
│  - IInputParser                              │
│  - ICache ◄──────────────────┐              │
└──────────────┬──────────────────┼───────────┘
               │ depends on      │
               ▼                  │
┌─────────────────────────────────┼───────────┐
│          DOMAIN LAYER           │           │
│  - Cart, Movie                  │           │
│  - Exceptions                   │           │
└─────────────────────────────────┘           │
                                               │
                                               │ implements
┌─────────────────────────────────────────────┘
│          INFRASTRUCTURE LAYER                │
│  Adapters:                                   │
│  - InputParser implements IInputParser       │
│  - RedisCache implements ICache              │
└──────────────────────────────────────────────┘
```

### ✅ Principes respectés

1. **DIP** : Application dépend d'ICache (abstraction), pas de RedisCache
2. **OCP** : Ouvert à l'extension (nouveau cache) sans modifier le code
3. **SRP** : DVDCalculatorService orchestre, ne gère pas le cache
4. **ISP** : ICache contient uniquement les méthodes nécessaires
5. **LSP** : MockCache et RedisCache sont substituables

---

## 🎯 Utilisation dans la présentation

### API (REST)

```typescript
// src/presentation/api/v1/routes.ts
const cacheKey = `calculate:v1:${sorted_titles}`;

if (request.server.cache) {
  const cached = await request.server.cache.get(cacheKey);
  if (cached) return reply.code(200).send(cached);
}

const result = calculator.calculateWithDetails(movies);

if (request.server.cache) {
  await request.server.cache.set(cacheKey, result, 3600);
}
```

### CLI

```typescript
// src/presentation/cli/index.ts
const inputParser = new InputParser();
const service = new DVDCalculatorService(inputParser);
// Pas de cache dans le CLI
```

### SDK

```typescript
// Les utilisateurs du SDK peuvent injecter un cache s'ils le souhaitent
import { DVDCalculatorService, RedisCache } from 'dvd-shop-calculator';

const cache = new RedisCache({ host: 'localhost', port: 6379 });
const service = new DVDCalculatorService(inputParser, cache);
```

---

## 📈 Résultats

✅ **164/164 tests passent (100%)**  
✅ **Build OK** (TypeScript compile)  
✅ **Lint OK** (0 erreur ESLint)  
✅ **Architecture Clean** respectée  
✅ **SOLID** principles appliqués  
✅ **Coverage** : 86%+ global  

---

## 🔑 Points clés

1. **Port ICache** : Interface dans la couche application
2. **Adapter RedisCache** : Implémentation concrète dans infrastructure
3. **DVDCalculatorService** : Service simple qui orchestre, ne gère pas le cache
4. **Présentation** : Responsable de l'utilisation du cache (API, pas CLI)
5. **Tests** : 20 tests unitaires pour le service, 20 pour RedisCache
6. **MockCache** : Pour tester sans Redis

---

## 📝 Commandes

```bash
# Tous les tests
npm test

# Tests du service uniquement
npm test -- src/application/services/__tests__/DVDCalculatorService.test.ts

# Tests de RedisCache uniquement
npm test -- src/infrastructure/__tests__/RedisCache.test.ts

# Build + Lint + Test
npm run build && npm run lint && npm test
```
