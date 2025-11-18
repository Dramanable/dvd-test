# 📦 DVD Shop Calculator SDK

Complete SDK documentation for programmatic usage of the DVD Shop Calculator.

## 🚀 Installation

```bash
npm install dvd-shop-calculator
```

## 📖 Quick Start

```typescript
import { DVDCalculator } from 'dvd-shop-calculator';

const calculator = new DVDCalculator();
const price = calculator.calculate(['Back to the Future 1', 'Back to the Future 2']);
console.log(price); // 27
```

## 📚 Table of Contents

- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
  - [DVDCalculator Class](#dvdcalculator-class)
  - [Domain Entities](#domain-entities)
  - [Types & Interfaces](#types--interfaces)
- [Usage Examples](#usage-examples)
- [Advanced Usage](#advanced-usage)
- [Testing](#testing)

---

## 🎯 Core Concepts

### Pricing Rules

- **Back to the Future DVDs**: 15€ each
- **Other movies**: 20€ each (no discount)
- **2 different BTTF episodes**: 10% discount on all BTTF DVDs
- **3 different BTTF episodes**: 20% discount on all BTTF DVDs

### Architecture

The SDK follows **Clean Architecture** principles:

```
SDK Layer (Public API)
    ↓
Application Layer (Use Cases)
    ↓
Domain Layer (Entities)
```

---

## 📘 API Reference

### DVDCalculator Class

Main facade for the SDK. Provides simple and fluent API.

#### Constructor

```typescript
const calculator = new DVDCalculator();
```

#### Methods

##### `calculate(movieTitles: string[]): number`

Calculate total price from an array of movie titles.

```typescript
const price = calculator.calculate(['Back to the Future 1', 'Back to the Future 2']);
// Returns: 27
```

**Parameters:**
- `movieTitles` - Array of movie title strings

**Returns:**
- `number` - Total price in euros

**Throws:**
- `Error` if movieTitles is null or undefined

---

##### `calculateWithDetails(movieTitles: string[]): CalculationResult`

Calculate price with detailed breakdown.

```typescript
const result = calculator.calculateWithDetails(['Back to the Future 1', 'Back to the Future 2']);
console.log(result);
// {
//   total: 27,
//   subtotal: 30,
//   discount: 3,
//   discountPercentage: 10,
//   itemCount: 2,
//   uniqueEpisodes: 2,
//   movies: [...]
// }
```

**Returns:** `CalculationResult` object with:
- `total: number` - Final price after discount
- `subtotal: number` - Price before discount
- `discount: number` - Discount amount in euros
- `discountPercentage: number` - Discount percentage (0, 10, or 20)
- `itemCount: number` - Total number of movies
- `uniqueEpisodes: number` - Number of unique BTTF episodes
- `movies: Array<MovieDetail>` - Array of movie details

---

##### `parseMovie(title: string): Movie`

Parse a movie title and create a Movie entity.

```typescript
const movie = calculator.parseMovie('Back to the Future 2');
console.log(movie.episode); // 2
console.log(movie.type); // 'BACK_TO_THE_FUTURE'
```

**Parameters:**
- `title` - Movie title string

**Returns:**
- `Movie` entity

---

##### Fluent API Methods

###### `addMovie(title: string): this`

Add a single movie to the cart (chainable).

```typescript
calculator
  .addMovie('Back to the Future 1')
  .addMovie('Back to the Future 2');
```

---

###### `addMovies(titles: string[]): this`

Add multiple movies to the cart (chainable).

```typescript
calculator.addMovies(['Back to the Future 1', 'Back to the Future 2', 'Back to the Future 3']);
```

---

###### `removeMovie(title: string): this`

Remove a movie from the cart by title (chainable).

```typescript
calculator
  .addMovie('Back to the Future 1')
  .addMovie('Back to the Future 2')
  .removeMovie('Back to the Future 2');
```

---

###### `reset(): this`

Reset the cart to empty state (chainable).

```typescript
calculator.reset().addMovie('Back to the Future 1');
```

---

###### `getTotal(): number`

Get current total price from internal cart.

```typescript
calculator.addMovie('Back to the Future 1');
const total = calculator.getTotal(); // 15
```

---

###### `getCartInfo(): CartInfo`

Get detailed cart information.

```typescript
const info = calculator.getCartInfo();
console.log(info);
// {
//   total: 27,
//   subtotal: 30,
//   discount: 3,
//   itemCount: 2,
//   uniqueEpisodes: 2
// }
```

---

###### `getMovies(): Movie[]`

Get all movies in the cart.

```typescript
const movies = calculator.getMovies();
movies.forEach(movie => console.log(movie.title));
```

---

### Domain Entities

#### Movie

Represents a DVD movie.

```typescript
import { Movie, MovieType } from 'dvd-shop-calculator';

const movie = new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1);
```

**Constructor:**
```typescript
constructor(
  title: string,
  type: MovieType,
  episode?: number
)
```

**Properties:**
- `title: string` - Movie title
- `type: MovieType` - BACK_TO_THE_FUTURE or OTHER
- `episode?: number` - Episode number (for BTTF movies)

**Methods:**
- `getBasePrice(): number` - Get base price (15€ or 20€)
- `isSameEpisode(other: Movie): boolean` - Check if same episode
- `isBackToTheFuture(): boolean` - Check if BTTF movie

---

#### Cart

Manages a collection of movies and calculates totals.

```typescript
import { Cart, Movie, MovieType } from 'dvd-shop-calculator';

const cart = new Cart();
cart.addMovie(new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1));
const total = cart.calculateTotal();
```

**Methods:**
- `addMovie(movie: Movie): void` - Add movie to cart
- `getMovies(): Movie[]` - Get all movies (returns copy)
- `calculateTotal(): number` - Calculate total with discounts

---

### Types & Interfaces

#### MovieType

```typescript
enum MovieType {
  BACK_TO_THE_FUTURE = 'BACK_TO_THE_FUTURE',
  OTHER = 'OTHER'
}
```

---

#### CalculationResult

```typescript
interface CalculationResult {
  total: number;              // Final price
  subtotal: number;           // Price before discount
  discount: number;           // Discount amount
  discountPercentage: number; // 0, 10, or 20
  itemCount: number;          // Total movies
  uniqueEpisodes: number;     // Unique BTTF episodes
  movies: Array<{
    title: string;
    type: MovieType;
    basePrice: number;
    episodeNumber?: number;
  }>;
}
```

---

#### CartInfo

```typescript
interface CartInfo {
  total: number;         // Final price
  subtotal: number;      // Price before discount
  discount: number;      // Discount amount
  itemCount: number;     // Total movies
  uniqueEpisodes: number; // Unique BTTF episodes
}
```

---

## 💡 Usage Examples

### Example 1: Basic Calculation

```typescript
import { DVDCalculator } from 'dvd-shop-calculator';

const calculator = new DVDCalculator();
const price = calculator.calculate([
  'Back to the Future 1',
  'Back to the Future 2'
]);
console.log(price); // 27€
```

### Example 2: Fluent API

```typescript
const price = new DVDCalculator()
  .addMovie('Back to the Future 1')
  .addMovie('Back to the Future 2')
  .addMovie('Other Movie')
  .getTotal();
console.log(price); // 47€
```

### Example 3: Detailed Calculation

```typescript
const calculator = new DVDCalculator();
const result = calculator.calculateWithDetails([
  'Back to the Future 1',
  'Back to the Future 2',
  'Back to the Future 3'
]);

console.log(`Subtotal: ${result.subtotal}€`);        // 45€
console.log(`Discount: ${result.discount}€`);         // 9€
console.log(`Total: ${result.total}€`);              // 36€
console.log(`Discount: ${result.discountPercentage}%`); // 20%
```

### Example 4: Stateful Operations

```typescript
const calculator = new DVDCalculator();

calculator.addMovie('Back to the Future 1');
console.log(calculator.getTotal()); // 15€

calculator.addMovie('Back to the Future 2');
console.log(calculator.getTotal()); // 27€

calculator.removeMovie('Back to the Future 2');
console.log(calculator.getTotal()); // 15€

calculator.reset();
console.log(calculator.getTotal()); // 0€
```

### Example 5: Using Entities Directly

```typescript
import { Cart, Movie, MovieType } from 'dvd-shop-calculator';

const cart = new Cart();
cart.addMovie(new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1));
cart.addMovie(new Movie('Back to the Future 2', MovieType.BACK_TO_THE_FUTURE, 2));
cart.addMovie(new Movie('Jurassic Park', MovieType.OTHER));

const total = cart.calculateTotal();
console.log(total); // 47€
```

### Example 6: Bulk Operations

```typescript
const movies = [
  'Back to the Future 1',
  'Back to the Future 2',
  'Back to the Future 3',
  'Star Wars',
  'Indiana Jones'
];

const price = new DVDCalculator()
  .addMovies(movies)
  .getTotal();
console.log(price); // 76€
```

### Example 7: Cart Information

```typescript
const calculator = new DVDCalculator();
calculator
  .addMovie('Back to the Future 1')
  .addMovie('Back to the Future 2')
  .addMovie('Back to the Future 1'); // duplicate

const info = calculator.getCartInfo();
console.log(info);
// {
//   itemCount: 3,
//   uniqueEpisodes: 2,
//   subtotal: 45,
//   discount: 5,
//   total: 41
// }
```

---

## 🔧 Advanced Usage

### Custom Movie Parsing

```typescript
const calculator = new DVDCalculator();
const movie = calculator.parseMovie('Back to the Future 2');

if (movie.isBackToTheFuture()) {
  console.log(`BTTF Episode ${movie.episode}`);
  console.log(`Base price: ${movie.getBasePrice()}€`);
}
```

### Using Use Cases Directly

```typescript
import { CalculateCartPrice } from 'dvd-shop-calculator';

const useCase = new CalculateCartPrice();
const price = useCase.execute([
  'Back to the Future 1',
  'Back to the Future 2',
  'Back to the Future 3'
]);
console.log(price); // 36€
```

### Dependency Injection

```typescript
import { DVDCalculatorApp, InputParser } from 'dvd-shop-calculator';

const parser = new InputParser();
const app = new DVDCalculatorApp(parser);
const result = app.run('Back to the Future 1\nBack to the Future 2');
console.log(result); // 27
```

---

## ✅ Testing

The SDK includes 60 tests (100% coverage):

```bash
npm test
```

### Test Structure
- **Domain Layer**: 22 tests (Movie + Cart entities)
- **Application Layer**: 9 tests (Use cases)
- **Infrastructure Layer**: 3 tests (Input parsing)
- **SDK Layer**: 26 tests (DVDCalculator facade)

---

## 🎓 Best Practices

### ✅ Do

- Use `DVDCalculator` for simple calculations
- Use fluent API for building carts incrementally
- Use `calculateWithDetails()` for detailed breakdowns
- Use domain entities for custom business logic

### ❌ Don't

- Don't modify Movie entities after creation (immutable)
- Don't rely on internal Cart array mutation
- Don't parse movie titles manually (use `parseMovie()`)

---

## 📝 TypeScript Support

Full TypeScript support with type definitions included:

```typescript
import type { CalculationResult, CartInfo } from 'dvd-shop-calculator';

const result: CalculationResult = calculator.calculateWithDetails([...]);
const info: CartInfo = calculator.getCartInfo();
```

---

## 🔗 Links

- [GitHub Repository](https://github.com/Dramanable/dvd-test)
- [Full Documentation](./README.md)
- [Examples](./examples/sdk-usage.ts)
- [Tests](./src/sdk/__tests__/DVDCalculator.test.ts)

---

## 📄 License

ISC

---

## 🤝 Contributing

Contributions welcome! Please follow TDD principles and maintain 100% test coverage.

---

**Built with ❤️ using TDD and Clean Architecture**
