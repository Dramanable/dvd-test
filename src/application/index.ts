/**
 * Application layer exports
 * Services, use cases, and ports (interfaces)
 */

// Services
export { DVDCalculatorService } from './services/DVDCalculatorService';

// Use Cases
export { CalculateCartPrice } from './use-cases/CalculateCartPrice';

// Ports (Interfaces)
export { CacheStats, ICache } from './ports/ICache';
export { IInputParser } from './ports/IInputParser';

// Legacy export for backward compatibility (deprecated)
export { DVDCalculatorService as DVDCalculatorApp } from './services/DVDCalculatorService';
