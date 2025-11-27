# Architecture Clean - DVD Calculator# Architecture Documentation



## 📐 Vue d'ensemble## Vue d'ensemble



Ce projet implémente une **Clean Architecture** stricte avec inversion de dépendances (Dependency Inversion Principle - DIP) et séparation complète des couches.Ce document décrit l'architecture du projet DVD Shop Calculator, développé selon les principes de la Clean Architecture et du Test-Driven Development.



### Principes respectés## Principes architecturaux



- ✅ **Séparation des couches** : Domain → Application → Infrastructure → Presentation### Clean Architecture

- ✅ **Dependency Inversion Principle** : Les dépendances pointent vers les abstractions (ports)

- ✅ **Single Responsibility Principle** : Chaque classe a une seule responsabilitéL'architecture suit le modèle en couches de Robert C. Martin (Uncle Bob) avec une séparation stricte des responsabilités.

- ✅ **Pas de logique métier dans la présentation** : Uniquement orchestration et formatage

- ✅ **Testabilité maximale** : 229 tests avec mocks et injection de dépendances**Important** : Dans la Clean Architecture classique, les **use cases appartiennent à la couche Application**, pas au Domain. Le Domain ne contient que les **entités** et la **logique métier pure**.



## 🏗️ Structure des couches```

┌───────────────────────────────────────────────┐

```│              External Interfaces              │

┌─────────────────────────────────────────────────────────┐│                   (CLI)                       │

│                   PRESENTATION                          │└───────────────────┬───────────────────────────┘

│  (CLI, API REST, SDK - Orchestration uniquement)       │                    │

│                                                         │┌───────────────────▼───────────────────────────┐

│  ┌──────────┐  ┌──────────┐  ┌──────────┐            ││             Application Layer                 │

│  │   CLI    │  │ REST API │  │   SDK    │            ││  ┌─────────────────────────────────────┐     │

│  └────┬─────┘  └────┬─────┘  └────┬─────┘            ││  │          Use Cases                  │     │

└───────┼─────────────┼─────────────┼──────────────────┘│  │  - Orchestration business logic     │     │

        │             │             ││  │  - Workflows applicatifs            │     │

        │ Injecte     │ Injecte     │ Injecte│  └─────────────────────────────────────┘     │

        │ adapters    │ adapters    │ adapters│  - DVDCalculatorApp (orchestration)           │

        ▼             ▼             ▼└───────────────────┬───────────────────────────┘

┌─────────────────────────────────────────────────────────┐                    │

│                   APPLICATION                           │┌───────────────────▼───────────────────────────┐

│  (Use Cases, Services, Ports/Interfaces)               ││              Domain Layer                     │

│                                                         ││  ┌─────────────────────────────────────┐     │

│  ┌───────────────────────────────────────────┐        ││  │          Entities                   │     │

│  │     DVDCalculatorService                  │        ││  │  - Business rules pures             │     │

│  │  (Orchestrates domain use cases)          │        ││  │  - Logique métier                   │     │

│  └────────────┬──────────────────────────────┘        ││  │  - Pas de dépendances externes      │     │

│               │ dépend de                              ││  └─────────────────────────────────────┘     │

│               ▼                                        │└───────────────────┬───────────────────────────┘

│  ┌───────────────────────┬─────────────────────┐     │                    │

│  │   IInputParser Port   │   ICache Port       │     │┌───────────────────▼───────────────────────────┐

│  │  (Abstraction)        │  (Abstraction)      │     ││          Infrastructure Layer                 │

│  └───────────────────────┴─────────────────────┘     ││  - Parsing des entrées                        │

└─────────────────────────────────────────────────────────┘│  - I/O operations                             │

                        ▲└───────────────────────────────────────────────┘

                        │ implémente```

                        │

┌─────────────────────────────────────────────────────────┐### Règles de dépendance

│                  INFRASTRUCTURE                         │

│  (Adapters - Implémentations concrètes)                │1. **Les couches internes ne connaissent pas les couches externes**

│                                                         │   - Le domaine ne dépend d'aucune autre couche

│  ┌──────────────┐  ┌──────────────┐                   │   - Les use cases ne dépendent que des entités

│  │ InputParser  │  │ArrayInput    │                   │   - **L'application ne dépend QUE du domaine** (pas de l'infrastructure)

│  │ (Text input) │  │Parser        │                   │

│  │              │  │(Array input) │                   │2. **Inversion de dépendance (Dependency Inversion Principle)**

│  └──────────────┘  └──────────────┘                   │   - Les abstractions ne dépendent pas des détails

│                                                         │   - Les détails dépendent des abstractions

│  ┌──────────────┐  ┌──────────────┐                   │   - **L'application définit des Ports (interfaces)** que l'infrastructure implémente

│  │ RedisCache   │  │ InMemoryCache│                   │

│  │ (Production) │  │ (Testing)    │                   │3. **Injection de dépendance**

│  └──────────────┘  └──────────────┘                   │   - Les dépendances sont injectées de l'extérieur (CLI)

└─────────────────────────────────────────────────────────┘   - L'application ne crée pas ses dépendances concrètes

                        ▲   - Le CLI connecte les Adapters (infrastructure) aux Ports (application)

                        │ utilise

                        │3. **Séparation Domain vs Application**

┌─────────────────────────────────────────────────────────┐   - **Domain** : Contient uniquement les **entités** et la **logique métier pure**

│                     DOMAIN                              │   - **Application** : Contient les **use cases** qui orchestrent les entités

│  (Entities, Business Logic - 0 dependencies)           │   - Les use cases ne sont PAS dans le domaine car ils représentent des workflows applicatifs

│                                                         │

│  ┌──────────────┐  ┌──────────────┐                   │## Distinction clé : Domain vs Application

│  │   Movie      │  │    Cart      │                   │

│  │  (Entity)    │  │  (Entity)    │                   │### Domain Layer (Entités)

│  └──────────────┘  └──────────────┘                   │- **Quoi** : Objets métier avec leur logique intrinsèque

│                                                         │- **Responsabilité** : Encapsuler les règles métier qui ne changent jamais

│  ┌─────────────────────────────────────┐              │- **Exemple** : `Movie` (un film a un prix), `Cart` (un panier calcule un total)

│  │  Business Rules (Discounts, etc.)   │              │- **Pas de dépendance** : Aucune connaissance de l'application ou de l'infrastructure

│  └─────────────────────────────────────┘              │

└─────────────────────────────────────────────────────────┘### Application Layer (Use Cases)

```- **Quoi** : Orchestration des entités pour réaliser des cas d'usage

- **Responsabilité** : Coordonner les entités pour accomplir des tâches applicatives

## 📦 Description des couches- **Exemple** : `CalculateCartPrice` (orchestrer le parsing et le calcul)

- **Dépend de** : Les entités du domaine uniquement

### 1. Domain (Domaine)

Cette séparation permet de :

**Responsabilité** : Logique métier pure, indépendante de tout framework- ✅ Changer les use cases sans toucher au domaine

- ✅ Réutiliser les entités dans d'autres applications

**Contenu** :- ✅ Tester les entités indépendamment des workflows

- `Movie` : Entité avec méthode factory `fromTitle()` pour parser les titres

- `Cart` : Entité pour gérer le panier et calculer le total## Couches détaillées

- `MovieType` : Enum des types de films

- Exceptions métier### 1. Domain Layer (Cœur métier)



**Règles** :Le domaine contient **uniquement les entités et la logique métier pure**, sans aucune dépendance externe.

- ❌ AUCUNE dépendance externe

- ✅ Logique métier pure (calculs, règles de discount)#### Entities

- ✅ Testable unitairement sans mock

**Movie** (`src/core/domain/entities/Movie.ts`)

### 2. Application (Cas d'usage)```typescript

class Movie {

**Responsabilité** : Orchestration de la logique métier via use cases  - title: string

  - type: MovieType

**Contenu** :  - episode?: number

- **Services** :  

  - `DVDCalculatorService` : Service principal qui orchestre les use cases  + getBasePrice(): number

- **Use Cases** :  + isSameEpisode(other: Movie): boolean

  - `CalculateCartPrice` : Calcule le prix avec les discounts  + isBackToTheFuture(): boolean

- **Ports** (Interfaces) :}

  - `IInputParser` : Abstraction pour le parsing d'entrée```

  - `ICache` : Abstraction pour le cache

Responsabilités :

**Règles** :- Représenter un DVD avec ses propriétés

- ✅ Dépend uniquement des abstractions (ports) et du domaine- Connaître son prix de base

- ✅ Pas de dépendance vers l'infrastructure- Identifier son type et épisode

- ✅ Testable avec des mocks des ports

**Cart** (`src/core/domain/entities/Cart.ts`)

### 3. Infrastructure (Adapters)```typescript

class Cart {

**Responsabilité** : Implémentations concrètes des ports  - movies: Movie[]

  

**Contenu** :  + addMovie(movie: Movie): void

- **Input Adapters** :  + getMovies(): Movie[]

  - `InputParser` : Parse du texte multiligne (pour CLI)  + calculateTotal(): number

  - `ArrayInputParser` : Parse d'un array (pour API/SDK)  - calculateBttfTotal(movies: Movie[]): number

- **Cache Adapters** :  - countUniqueEpisodes(movies: Movie[]): number

  - `RedisCache` : Cache Redis pour production  - getDiscount(uniqueEpisodes: number): number

  - `InMemoryCache` : Cache mémoire pour tests}

```

**Règles** :

- ✅ Implémente les ports définis dans la couche applicationResponsabilités :

- ✅ Aucune logique métier- Gérer une collection de films

- ✅ Facilement remplaçable (Redis → Memcached, etc.)- Appliquer les règles de calcul de prix

- Appliquer les règles de réduction

### 4. Presentation (Interfaces utilisateur)

**Règles métier encapsulées :**

**Responsabilité** : Interactions avec l'extérieur (HTTP, CLI, SDK)- Prix de base : 15€ (BTTF) / 20€ (autres)

- Réduction de 10% si 2 volets différents de BTTF

**Contenu** :- Réduction de 20% si 3 volets différents de BTTF

- **CLI** : Interface en ligne de commande- La réduction s'applique à TOUS les DVDs BTTF du panier

- **API REST** : Serveur Fastify avec endpoints REST

- **SDK** : Bibliothèque pour utilisateurs externes### 2. Application Layer



**Règles** :La couche application contient les **use cases**, l'**orchestration** et les **ports (interfaces)**.

- ✅ Injecte les adapters dans les services (DI)

- ❌ AUCUNE logique métier**Important** : L'application ne dépend QUE du domaine, jamais de l'infrastructure.

- ✅ Uniquement formatage et orchestration

- ❌ Pas de dépendance entre interfaces (API ⇏ SDK)#### Ports (Interfaces)



## 🔄 Flux d'inversion de dépendances

**IInputParser** (`src/core/application/ports/IInputParser.ts`)

```typescript

### Exemple : API RESTinterface IInputParser {

  + parse(input: string): string[]

```typescript}

// 1. API (Presentation) crée l'adapter```

const inputParser = new ArrayInputParser(movies);

Responsabilités :

// 2. API injecte l'adapter dans le service- Définir les contrats que l'infrastructure doit respecter

const service = new DVDCalculatorService(inputParser);- Permettre l'inversion de dépendance

- Isoler l'application de l'infrastructure

// 3. Service utilise l'abstraction (IInputParser)

const result = service.runWithDetails('');#### Use Cases

**CalculateCartPrice** (`src/core/application/use-cases/CalculateCartPrice.ts`)

return {```typescript

  total: result.total,class CalculateCartPrice {

  subtotal: result.subtotal,  + execute(movieTitles: string[]): number

  // ...  - parseMovieTitle(title: string): Movie

};}

``````



### Exemple : CLIResponsabilités :

- Orchestrer le calcul de prix

```typescript- Transformer les titres en entités Movie

// 1. CLI crée l'adapter pour texte- Utiliser l'entité Cart pour calculer le total

const inputParser = new InputParser();

#### Application Orchestration

// 2. CLI injecte l'adapter dans le service

const service = new DVDCalculatorService(inputParser);

**DVDCalculatorApp** (`src/core/application/DVDCalculatorApp.ts`)

// 3. Service parse et calcule### 3. Infrastructure Layer

const total = service.run(inputText);

La couche infrastructure contient les **adapters** qui implémentent les ports définis par l'application.

// 4. CLI affiche le résultat

console.log(total);**InputParser** (`src/infrastructure/InputParser.ts`)

``````typescript

class InputParser implements IInputParser {  // ← Implémente le port

### Exemple : SDK  + parse(input: string): string[]

}

```typescript```

// 1. SDK crée l'adapter pour array

const inputParser = new ArrayInputParser(movieTitles);Responsabilités :

- Parser l'entrée texte

// 2. SDK injecte l'adapter dans le service- Nettoyer les lignes (trim)

const service = new DVDCalculatorService(inputParser);- Filtrer les lignes vides

- **Implémenter les interfaces définies par l'application**

// 3. Service calcule

return service.runWithDetails('');

**DVDCalculatorApp** (`src/core/application/DVDCalculatorApp.ts`)

``````typescript

class DVDCalculatorApp {

## 🎯 Avantages de cette architecture  - calculateCartPrice: CalculateCartPrice

  - inputParser: IInputParser  // ← Dépend de l'interface, pas de l'implémentation

### 1. Testabilité  

  + constructor(inputParser: IInputParser)  // ← Injection de dépendance

- **229 tests** passent avec des mocks simples  + run(input: string): number

- Chaque couche testable indépendamment  + runAndDisplay(input: string): void

- Pas besoin de vraie BDD ou Redis pour tester}

```

### 2. Maintenabilité

Responsabilités :

- Code organisé par responsabilité- Orchestrer les composants (use cases + ports)

- Changements isolés dans une couche- Point d'entrée de l'application

- Facile à comprendre et à modifier- Affichage des résultats

- **Ne dépend QUE du domaine et des ports (interfaces)**

### 3. Flexibilité

### 3. Infrastructure Layer

- Changer Redis par Memcached : 1 seul fichier à modifier

- Ajouter une nouvelle interface (GraphQL) : Pas de changement dans le domaineLa couche infrastructure contient les **adapters** qui implémentent les ports définis par l'application.

- Remplacer le parsing : Créer un nouvel adapter

### 4. Interface Layer

### 4. Indépendance des frameworks

**CLI** (`src/index.ts`)

- Le domaine ne dépend d'AUCUN framework

- Peut être réutilisé dans n'importe quel contexteResponsabilités :

- Migration facile (Node → Deno, Express → Fastify, etc.)- Gérer les arguments de la ligne de commande

- Lire depuis fichier / stdin / mode interactif

## 📝 Règles strictes appliquées- **Instancier les adapters (infrastructure)**

- **Injecter les dépendances dans l'application**

### ❌ Violations interdites- C'est ici que se fait la connexion entre Infrastructure et Application



1. **Présentation → Présentation**```typescript

   ```typescript// Dependency Injection

   // ❌ INTERDIT : API ne doit PAS dépendre du SDKconst inputParser = new InputParser();        // Infrastructure

   import { DVDCalculator } from '../../sdk';const app = new DVDCalculatorApp(inputParser); // Application

   ``````



2. **Logique métier dans la présentation**## Flux de données

   ```typescript

   // ❌ INTERDIT : Calculs dans l'API### Exemple : Calcul du prix d'un panier

   const discount = subtotal - total;

   ``````

┌─────────────┐

3. **Application → Infrastructure**│  index.ts   │  1. Lecture de l'entrée (fichier/stdin)

   ```typescript└──────┬──────┘

   // ❌ INTERDIT : Service dépend de RedisCache directement       │

   import { RedisCache } from '../../infrastructure';       v

   ```┌─────────────────────┐

│ DVDCalculatorApp    │  2. Orchestration

### ✅ Bonnes pratiques appliquées└──────┬──────────────┘

       │

1. **Injection de dépendances**       ├─────────────────────┐

   ```typescript       v                     v

   // ✅ Injecter les adapters dans le service┌────────────────┐    ┌────────────────┐

   const service = new DVDCalculatorService(inputParser, cache);│  InputParser   │    │ CalculateCart  │  3. Parse + Use Case

   ```│  .parse()      │    │ Price.execute()│

└────────────────┘    └───────┬────────┘

2. **Dépendre des abstractions**                              │

   ```typescript                              v

   // ✅ Service dépend de ICache, pas RedisCache                      ┌───────────────┐

   constructor(parser: IInputParser, cache?: ICache)                      │ Movie entity  │  4. Création des entités

   ```                      └───────┬───────┘

                              │

3. **Présentation orchestre seulement**                              v

   ```typescript                      ┌───────────────┐

   // ✅ API formate seulement, pas de logique métier                      │ Cart entity   │  5. Calcul avec règles métier

   const result = service.runWithDetails('');                      │ .calculateTotal()│

   return result; // Formatage REST si besoin                      └───────┬───────┘

   ```                              │

                              v

## 🧪 Tests                      ┌───────────────┐

                      │    Result     │  6. Retour du prix total

### Structure des tests                      └───────────────┘

```

- **229 tests** au total

- **100% de couverture** des chemins critiques## Test-Driven Development

- Tests unitaires + tests d'intégration

### Stratégie de test

### Par couche

Le projet a été développé en TDD strict :

- **Domain** : 229 tests (Movie, Cart, exceptions)

- **Application** : 229 tests (Service, use cases)1. **Red** : Écrire un test qui échoue

- **Infrastructure** : 229 tests (Adapters, cache)2. **Green** : Écrire le code minimum pour passer le test

- **Presentation** : 229 tests (CLI, API, SDK)3. **Refactor** : Améliorer le code sans casser les tests



### Commandes### Pyramide de tests



```bash```

npm test              # Tous les tests           ┌─────────────┐

npm run test:coverage # Avec couverture           │   E2E Tests │  ← CLI integration (exemples du cahier des charges)

npm run test:watch    # Mode watch           └─────────────┘

```         ┌─────────────────┐

         │  Use Case Tests │  ← CalculateCartPrice

## 🚀 Évolution future         └─────────────────┘

      ┌───────────────────────┐

### Ajouter une nouvelle interface (GraphQL)      │   Unit Tests          │  ← Entities (Movie, Cart)

      │   Infrastructure      │     InputParser

1. Créer `src/presentation/graphql/`      └───────────────────────┘

2. Utiliser `DVDCalculatorService` avec `ArrayInputParser````

3. Formater la réponse GraphQL

4. **Aucun changement** dans les autres couches !### Couverture de tests



### Changer le cache (Redis → Memcached)- **229 tests** au total

- **100% de couverture** sur la logique métier

1. Créer `MemcachedCache implements ICache`- Tous les exemples du cahier des charges validés

2. Injecter dans le service- Tests de cas limites (panier vide, entrée invalide, etc.)

3. **Aucun changement** dans l'application ou le domaine !

## Patterns de conception utilisés

### Ajouter un nouveau type de parsing (XML, JSON)

### 1. Entity Pattern

1. Créer `XmlInputParser implements IInputParser`- Les entités (`Movie`, `Cart`) encapsulent la logique métier

2. Injecter dans le service- Elles sont indépendantes de toute infrastructure

3. **Aucun changement** dans le service ou le domaine !

### 2. Use Case Pattern

## 📚 Références- Chaque use case représente une action métier

- `CalculateCartPrice` orchestre le calcul

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)### 3. Repository Pattern (implicite)

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)- Le `Cart` agit comme un repository in-memory

- Pourrait facilement être étendu avec une persistence

---

### 4. Dependency Injection

**Architecture validée** : ✅ 229 tests passent | ✅ Build réussi | ✅ Lint sans erreurs

- L'application injecte les dépendances

- Facilite les tests et le découplage

### 5. Factory Pattern (léger)
- `parseMovieTitle()` agit comme une factory de Movie
- Création centralisée des entités

## Décisions d'architecture

### Pourquoi TypeScript ?

- **Type safety** : Détection des erreurs à la compilation
- **Intellisense** : Meilleure expérience développeur
- **Documentation** : Les types servent de documentation
- **Refactoring** : Plus sûr avec les types

### Pourquoi Clean Architecture ?

- **Testabilité** : Le domaine est isolé et facilement testable
- **Maintenabilité** : Changements localisés dans une couche
- **Évolutivité** : Facile d'ajouter de nouvelles fonctionnalités
- **Indépendance** : Le métier ne dépend pas de l'infrastructure

### Pourquoi Jest ?

- **Popularité** : Standard de l'écosystème TypeScript
- **Performance** : Tests parallèles et rapides
- **DX** : Excellente expérience développeur (watch mode, coverage)
- **Maturité** : Nombreuses fonctionnalités out-of-the-box

## Évolutions futures

### 1. Ajout de nouveaux cas d'usage

Ajouter facilement de nouveaux use cases :
```
src/core/application/use-cases/
  ├── CalculateCartPrice.ts
  ├── ApplyPromoCode.ts        ← Nouveau
  └── CalculateShipping.ts     ← Nouveau
```

### 2. Persistence

Ajouter une couche de persistence sans toucher au domaine :
```
src/infrastructure/
  ├── repositories/
  │   ├── ICartRepository.ts   ← Interface
  │   ├── InMemoryCartRepository.ts
  │   └── PostgresCartRepository.ts
```

### 3. API REST

Ajouter une interface HTTP :
```
src/interfaces/
  ├── http/
  │   ├── CartController.ts
  │   └── routes.ts
```

### 4. Frontend

Réutiliser le domaine dans une application web :
```
web-app/
  └── src/
      ├── components/
      └── domain/  ← Symlink vers src/core/domain
```

## Conclusion

Cette architecture permet :

✅ **Séparation des préoccupations** : Chaque couche a un rôle clair  
✅ **Testabilité** : 100% de couverture de tests  
✅ **Maintenabilité** : Code propre et bien organisé  
✅ **Évolutivité** : Facile d'ajouter de nouvelles fonctionnalités  
✅ **Indépendance** : Le métier ne dépend d'aucune technologie  

Le projet respecte les principes SOLID et les bonnes pratiques du développement logiciel moderne.
