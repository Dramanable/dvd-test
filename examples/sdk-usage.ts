/**
 * SDK Usage Examples
 *
 * This file demonstrates various ways to use the DVD Calculator SDK
 */

import { DVDCalculator, Cart, Movie, MovieType, CalculateCartPrice } from '../src/sdk';

console.log('='.repeat(60));
console.log('DVD Shop Calculator - SDK Usage Examples');
console.log('='.repeat(60));
console.log();

// Example 1: Simple calculation
console.log('📦 Example 1: Simple calculation');
console.log('-'.repeat(60));
const calculator1 = new DVDCalculator();
const price1 = calculator1.calculate(['Back to the Future 1', 'Back to the Future 2']);
console.log('Movies: Back to the Future 1, Back to the Future 2');
console.log(`Price: ${price1}€`);
console.log('Expected: 27€ (15€ + 15€ with 10% discount)');
console.log();

// Example 2: Detailed calculation
console.log('📊 Example 2: Detailed calculation');
console.log('-'.repeat(60));
const calculator2 = new DVDCalculator();
const details = calculator2.calculateWithDetails([
  'Back to the Future 1',
  'Back to the Future 2',
  'Back to the Future 3',
]);
console.log('Movies: Back to the Future 1, 2, 3');
console.log(`Subtotal: ${details.subtotal}€`);
console.log(`Discount: ${details.discount}€ (${details.discountPercentage}%)`);
console.log(`Total: ${details.total}€`);
console.log(`Items: ${details.itemCount}`);
console.log(`Unique episodes: ${details.uniqueEpisodes}`);
console.log();

// Example 3: Fluent API
console.log('🔄 Example 3: Fluent API');
console.log('-'.repeat(60));
const price3 = new DVDCalculator()
  .addMovie('Back to the Future 1')
  .addMovie('Back to the Future 2')
  .addMovie('Other Movie')
  .getTotal();
console.log('Fluent chain: addMovie(BTTF1).addMovie(BTTF2).addMovie(Other).getTotal()');
console.log(`Price: ${price3}€`);
console.log('Expected: 47€ (27€ for BTTF with discount + 20€ for Other)');
console.log();

// Example 4: Using entities directly
console.log('🏗️  Example 4: Using entities directly');
console.log('-'.repeat(60));
const cart = new Cart();
cart.addMovie(new Movie('Back to the Future 1', MovieType.BACK_TO_THE_FUTURE, 1));
cart.addMovie(new Movie('Back to the Future 2', MovieType.BACK_TO_THE_FUTURE, 2));
cart.addMovie(new Movie('Jurassic Park', MovieType.OTHER));
const total4 = cart.calculateTotal();
console.log('Direct Cart usage with Movie entities');
console.log(`Movies in cart: ${cart.getMovies().length}`);
console.log(`Total: ${total4}€`);
console.log();

// Example 5: Stateful calculator
console.log('💾 Example 5: Stateful calculator with operations');
console.log('-'.repeat(60));
const calculator5 = new DVDCalculator();
calculator5.addMovie('Back to the Future 1');
console.log(`After adding BTTF1: ${calculator5.getTotal()}€`);

calculator5.addMovie('Back to the Future 2');
console.log(`After adding BTTF2: ${calculator5.getTotal()}€`);

calculator5.addMovie('Back to the Future 3');
console.log(`After adding BTTF3: ${calculator5.getTotal()}€`);

calculator5.removeMovie('Back to the Future 3');
console.log(`After removing BTTF3: ${calculator5.getTotal()}€`);

calculator5.reset();
console.log(`After reset: ${calculator5.getTotal()}€`);
console.log();

// Example 6: Get cart information
console.log('ℹ️  Example 6: Cart information');
console.log('-'.repeat(60));
const calculator6 = new DVDCalculator();
calculator6
  .addMovie('Back to the Future 1')
  .addMovie('Back to the Future 2')
  .addMovie('Back to the Future 1'); // Duplicate

const info = calculator6.getCartInfo();
console.log('Cart with: BTTF1, BTTF2, BTTF1 (duplicate)');
console.log(`Items: ${info.itemCount}`);
console.log(`Unique episodes: ${info.uniqueEpisodes}`);
console.log(`Subtotal: ${info.subtotal}€`);
console.log(`Discount: ${info.discount}€`);
console.log(`Total: ${info.total}€`);
console.log();

// Example 7: Parsing movies
console.log('🔍 Example 7: Movie parsing');
console.log('-'.repeat(60));
const calculator7 = new DVDCalculator();
const bttf1 = calculator7.parseMovie('Back to the Future 1');
const bttf2 = calculator7.parseMovie('Back to the Future 2');
const other = calculator7.parseMovie('The Matrix');

console.log(`BTTF1: type=${bttf1.type}, episode=${bttf1.episode}, price=${bttf1.getBasePrice()}€`);
console.log(`BTTF2: type=${bttf2.type}, episode=${bttf2.episode}, price=${bttf2.getBasePrice()}€`);
console.log(`Other: type=${other.type}, episode=${other.episode}, price=${other.getBasePrice()}€`);
console.log();

// Example 8: Using the use case directly
console.log('⚙️  Example 8: Using CalculateCartPrice use case');
console.log('-'.repeat(60));
const useCase = new CalculateCartPrice();
const price8 = useCase.execute([
  'Back to the Future 1',
  'Back to the Future 2',
  'Back to the Future 3',
]);
console.log('Direct use case: CalculateCartPrice.execute([BTTF1, BTTF2, BTTF3])');
console.log(`Price: ${price8}€`);
console.log();

// Example 9: Bulk operations
console.log('📚 Example 9: Bulk operations');
console.log('-'.repeat(60));
const movies = [
  'Back to the Future 1',
  'Back to the Future 2',
  'Back to the Future 3',
  'Star Wars',
  'Indiana Jones',
];
const calculator9 = new DVDCalculator();
const price9 = calculator9.addMovies(movies).getTotal();
console.log(`Movies: ${movies.join(', ')}`);
console.log(`Total: ${price9}€`);
console.log('Expected: 36€ (BTTF with 20% discount) + 40€ (2 others) = 76€');
console.log();

// Example 10: Edge cases
console.log('🔬 Example 10: Edge cases');
console.log('-'.repeat(60));
const calculator10 = new DVDCalculator();

const empty = calculator10.calculate([]);
console.log(`Empty array: ${empty}€`);

const withSpaces = calculator10.calculate(['  Back to the Future 1  ', '', '  ']);
console.log(`With spaces and empty strings: ${withSpaces}€`);

const duplicate = calculator10.calculate([
  'Back to the Future 1',
  'Back to the Future 1',
  'Back to the Future 1',
]);
console.log(`3 same episodes (no discount): ${duplicate}€`);
console.log();

console.log('='.repeat(60));
console.log('✅ All examples completed successfully!');
console.log('='.repeat(60));
