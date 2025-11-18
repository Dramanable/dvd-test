# Contributing to DVD Calculator

First off, thank you for considering contributing to DVD Calculator! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Project Structure](#project-structure)

## 📜 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

- Be respectful and inclusive
- Welcome newcomers and encourage diverse perspectives
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 24.0.0
- **npm** >= 10.0.0
- **Git**
- **Docker** (optional, for container testing)

### Initial Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/dvd-test.git
cd dvd-test

# 3. Add upstream remote
git remote add upstream https://github.com/Dramanable/dvd-test.git

# 4. Install dependencies
npm install

# 5. Run tests to verify setup
npm test

# 6. Start development
npm run dev:api
```

## 🔄 Development Process

### 1. Create a Feature Branch

```bash
# Update your local master
git checkout master
git pull upstream master

# Create a new branch
git checkout -b feature/my-awesome-feature
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Follow the [Coding Standards](#coding-standards)
- Write/update tests
- Update documentation
- Follow [Commit Guidelines](#commit-guidelines)

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run lint
npm run lint

# Fix formatting
npm run format

# Build
npm run build
```

### 4. Keep Your Branch Updated

```bash
# Fetch latest changes
git fetch upstream

# Rebase your branch
git rebase upstream/master
```

## 📤 Pull Request Process

### Before Submitting

- [ ] All tests pass (`npm test`)
- [ ] Code coverage >= 90% (`npm run test:coverage`)
- [ ] No lint errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation is updated
- [ ] Commit messages follow convention

### Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/my-awesome-feature
   ```

2. Open a Pull Request on GitHub

3. Fill out the PR template completely

4. Link any related issues

5. Wait for review and address feedback

### Pull Request Title Format

```
<type>(<scope>): <description>

Examples:
feat(api): add rate limiting to endpoints
fix(sdk): handle null input correctly
docs(readme): update installation steps
test(domain): add Cart entity tests
```

## 🎨 Coding Standards

### TypeScript

- **Strict mode**: Always enabled
- **No `any`**: Use proper types or `unknown`
- **Explicit return types**: Required on all functions
- **No implicit returns**: Be explicit

```typescript
// ✅ Good
function calculate(movies: string[]): number {
  return movies.length * 20;
}

// ❌ Bad
function calculate(movies: any) {
  return movies.length * 20;
}
```

### Clean Architecture

Follow the project's Clean Architecture layers:

```
domain/        - Business entities and exceptions
application/   - Use cases and business logic
infrastructure/- External implementations
interface/     - API, CLI, SDK
```

### Naming Conventions

- **Classes**: `PascalCase` (e.g., `DVDCalculator`)
- **Functions**: `camelCase` (e.g., `calculatePrice`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_DISCOUNT`)
- **Files**: `kebab-case.ts` (e.g., `calculate-cart-price.ts`)
- **Interfaces**: `PascalCase` with `I` prefix (e.g., `IInputParser`)
- **Types**: `PascalCase` (e.g., `MovieType`)

### Code Style

- **ESLint**: Configured and enforced
- **Prettier**: Auto-format on save
- **Line length**: Max 100 characters
- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Required

## 🧪 Testing Guidelines

### Test-Driven Development (TDD)

We follow strict TDD:

1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Clean up code

### Test Structure

```typescript
describe('Feature Name', () => {
  describe('Specific Scenario', () => {
    it('should behave in expected way', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = myFunction(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Test Coverage Requirements

- **Statements**: >= 90%
- **Branches**: >= 75%
- **Functions**: >= 90%
- **Lines**: >= 90%

### What to Test

- ✅ All business logic
- ✅ Edge cases and error conditions
- ✅ Public API methods
- ✅ Integration points
- ❌ External libraries
- ❌ Trivial getters/setters

## 📝 Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `build`: Build system or dependencies
- `ci`: CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

### Scopes

- `api`: REST API
- `sdk`: SDK layer
- `cli`: Command-line interface
- `domain`: Domain entities
- `application`: Use cases
- `infrastructure`: External implementations
- `docker`: Docker configuration
- `ci`: CI/CD pipelines

### Examples

```bash
# Feature
git commit -m "feat(api): add rate limiting middleware"

# Bug fix with issue reference
git commit -m "fix(sdk): handle null movieTitles input

Fixes #123"

# Breaking change
git commit -m "feat(api): migrate to v2 endpoints

BREAKING CHANGE: API endpoints moved to /v2/api/*"
```

## 📂 Project Structure

```
src/
├── api/                  # REST API (Fastify)
│   ├── __tests__/       # API tests
│   ├── index.ts         # Entry point
│   ├── server.ts        # Server configuration
│   ├── routes.ts        # Route definitions
│   └── swagger.ts       # OpenAPI spec
├── sdk/                  # Public SDK
│   ├── __tests__/       # SDK tests
│   ├── DVDCalculator.ts # Main SDK class
│   └── index.ts         # SDK exports
├── application/          # Use cases
│   ├── use-cases/       # Business operations
│   └── ports/           # Interfaces
├── domain/              # Domain layer
│   ├── entities/        # Business entities
│   └── exceptions/      # Custom exceptions
├── infrastructure/      # External implementations
└── index.ts             # CLI entry point
```

## 🐛 Reporting Bugs

### Before Submitting

- Check existing issues
- Verify it's reproducible
- Test on latest version

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Run command '...'
2. Call function '...'
3. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Environment**
- OS: [e.g., Ubuntu 22.04]
- Node.js: [e.g., 24.0.0]
- Version: [e.g., 1.0.0]

**Additional Context**
Logs, screenshots, etc.
```

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check existing issues/discussions
2. Describe the problem you're solving
3. Propose a solution
4. Provide examples

## 📞 Getting Help

- 📖 [Documentation](./README.md)
- 🐛 [Issue Tracker](https://github.com/Dramanable/dvd-test/issues)
- 💬 [Discussions](https://github.com/Dramanable/dvd-test/discussions)

## 📜 License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing! 🙏
