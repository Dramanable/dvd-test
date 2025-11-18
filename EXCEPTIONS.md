# Exception Handling Guide

Guide complet sur la gestion des exceptions personnalisées dans le DVD Calculator.

## 📋 Vue d'ensemble

Le projet utilise une hiérarchie d'exceptions personnalisées au lieu de `Error` standard pour :
- ✅ **Structure** : Codes d'erreur standardisés
- ✅ **Traçabilité** : Timestamps automatiques
- ✅ **API-friendly** : Conversion JSON intégrée
- ✅ **Type-safety** : Typage strict TypeScript
- ✅ **Debugging** : Stack traces préservés

## 🏗️ Hiérarchie des exceptions

```
Error (native)
  └── DomainException (abstract)
        └── ValidationException
```

### DomainException (Base)

Classe abstraite de base pour toutes les exceptions du domaine.

**Propriétés :**
- `message: string` - Message d'erreur
- `code: string` - Code d'erreur unique
- `name: string` - Nom de la classe d'exception
- `timestamp: Date` - Date/heure de création
- `stack: string` - Stack trace

**Méthodes :**
- `toJSON()` - Convertit en objet JSON pour les réponses API

**Exemple :**
```typescript
import { DomainException } from './domain/exceptions';

class CustomException extends DomainException {
  constructor(message: string) {
    super(message, 'CUSTOM_ERROR_CODE');
  }
}

throw new CustomException('Something went wrong');
```

### ValidationException

Exception pour les erreurs de validation d'entrée.

**Propriétés supplémentaires :**
- `field?: string` - Nom du champ invalide
- `value?: unknown` - Valeur invalide

**Factory methods :**

#### `ValidationException.nullOrUndefined(fieldName: string)`
```typescript
if (movieTitles === null || movieTitles === undefined) {
  throw ValidationException.nullOrUndefined('movieTitles');
}
// Lève: "movieTitles cannot be null or undefined"
```

#### `ValidationException.invalidType(field: string, expectedType: string, actualValue: unknown)`
```typescript
if (typeof age !== 'number') {
  throw ValidationException.invalidType('age', 'number', age);
}
// Lève: "age must be of type number"
```

#### `ValidationException.emptyArray(fieldName: string)`
```typescript
if (items.length === 0) {
  throw ValidationException.emptyArray('items');
}
// Lève: "items cannot be an empty array"
```

## 🎯 Utilisation

### Dans le code métier

```typescript
import { ValidationException } from './domain/exceptions';

class DVDCalculator {
  calculate(movieTitles: string[]): number {
    // Validation avec exception personnalisée
    if (movieTitles === null || movieTitles === undefined) {
      throw ValidationException.nullOrUndefined('movieTitles');
    }

    if (!Array.isArray(movieTitles)) {
      throw ValidationException.invalidType('movieTitles', 'array', movieTitles);
    }

    if (movieTitles.length === 0) {
      throw ValidationException.emptyArray('movieTitles');
    }

    // Logique métier...
  }
}
```

### Dans l'API REST

```typescript
import { ValidationException, DomainException } from './domain/exceptions';

app.post('/calculate', async (request, reply) => {
  try {
    const result = calculator.calculate(request.body.movies);
    return reply.send(result);
  } catch (error) {
    if (error instanceof ValidationException) {
      return reply.code(400).send(error.toJSON());
    }
    
    if (error instanceof DomainException) {
      return reply.code(500).send(error.toJSON());
    }
    
    // Erreur inconnue
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
});
```

### Format de réponse JSON

```json
{
  "name": "ValidationException",
  "message": "movieTitles cannot be null or undefined",
  "code": "VALIDATION_ERROR",
  "timestamp": "2024-01-18T10:30:00.000Z",
  "field": "movieTitles",
  "value": null
}
```

## 🧪 Tests

Toutes les exceptions sont testées avec 26 tests couvrant :

### DomainException (13 tests)
- ✅ Création avec message et code
- ✅ Timestamp automatique
- ✅ Conversion JSON
- ✅ Format ISO timestamp
- ✅ Nom de classe correct
- ✅ Stack trace préservé
- ✅ Lancement et capture
- ✅ Héritage maintenu
- ✅ Codes d'erreur personnalisés

### ValidationException (13 tests)
- ✅ Création avec champ et valeur
- ✅ Factory method `nullOrUndefined`
- ✅ Factory method `invalidType`
- ✅ Factory method `emptyArray`
- ✅ Conversion JSON avec champs
- ✅ Héritage de DomainException
- ✅ Capture typée dans try-catch

**Exécuter les tests :**
```bash
npm test src/domain/exceptions
```

## 📊 Codes d'erreur

| Code | Exception | Description |
|------|-----------|-------------|
| `VALIDATION_ERROR` | ValidationException | Erreur de validation d'entrée |
| *(extensible)* | *(futures exceptions)* | *(à définir)* |

## 🔧 Bonnes pratiques

### ✅ À faire

1. **Utiliser les factory methods**
   ```typescript
   throw ValidationException.nullOrUndefined('field');
   ```

2. **Catcher par type spécifique**
   ```typescript
   try {
     // code
   } catch (error) {
     if (error instanceof ValidationException) {
       // Gérer validation
     } else if (error instanceof DomainException) {
       // Gérer domaine
     }
   }
   ```

3. **Renvoyer toJSON() dans l'API**
   ```typescript
   return reply.code(400).send(error.toJSON());
   ```

4. **Tester les exceptions**
   ```typescript
   expect(() => {
     throw ValidationException.nullOrUndefined('test');
   }).toThrow(ValidationException);
   ```

### ❌ À éviter

1. **Ne pas utiliser Error natif**
   ```typescript
   // ❌ Mauvais
   throw new Error('Invalid input');
   
   // ✅ Bon
   throw ValidationException.invalidType('input', 'string', input);
   ```

2. **Ne pas ignorer les types**
   ```typescript
   // ❌ Mauvais
   catch (error) {
     console.log(error.message); // error est 'unknown'
   }
   
   // ✅ Bon
   catch (error) {
     if (error instanceof ValidationException) {
       console.log(error.message);
       console.log(error.field);
     }
   }
   ```

3. **Ne pas oublier le code d'erreur**
   ```typescript
   // ❌ Mauvais
   class MyException extends DomainException {
     constructor() {
       super('Error'); // Pas de code
     }
   }
   
   // ✅ Bon
   class MyException extends DomainException {
     constructor() {
       super('Error', 'MY_ERROR_CODE');
     }
   }
   ```

## 🚀 Étendre la hiérarchie

### Créer une nouvelle exception

```typescript
import { DomainException } from './DomainException';

export class BusinessRuleException extends DomainException {
  public readonly rule: string;

  constructor(message: string, rule: string) {
    super(message, 'BUSINESS_RULE_VIOLATION');
    this.rule = rule;
  }

  static discountLimitExceeded(amount: number): BusinessRuleException {
    return new BusinessRuleException(
      `Discount amount ${amount}€ exceeds maximum allowed`,
      'MAX_DISCOUNT_EXCEEDED'
    );
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      rule: this.rule,
    };
  }
}
```

### Tests de la nouvelle exception

```typescript
describe('BusinessRuleException', () => {
  it('should create with rule information', () => {
    const exception = BusinessRuleException.discountLimitExceeded(100);
    
    expect(exception.message).toContain('100€');
    expect(exception.code).toBe('BUSINESS_RULE_VIOLATION');
    expect(exception.rule).toBe('MAX_DISCOUNT_EXCEEDED');
  });
});
```

## 📈 Statistiques

- **102 tests** passent (76 existants + 26 exceptions)
- **100% couverture** sur les exceptions
- **0 erreur** ESLint
- **Type-safe** : Pas de `any`, strict TypeScript

## 📚 Ressources

- [src/domain/exceptions/DomainException.ts](../src/domain/exceptions/DomainException.ts) - Classe de base
- [src/domain/exceptions/ValidationException.ts](../src/domain/exceptions/ValidationException.ts) - Validation
- [src/domain/exceptions/__tests__/](../src/domain/exceptions/__tests__/) - Tests complets
- [TypeScript Error Handling Best Practices](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## 🆘 Dépannage

### Exception non capturée

```typescript
// Problème
try {
  // code
} catch (e) {
  console.log(e.field); // Error: Property 'field' does not exist
}

// Solution
catch (error) {
  if (error instanceof ValidationException) {
    console.log(error.field); // ✅ Type-safe
  }
}
```

### Stack trace incomplet

Les stack traces sont automatiquement capturés via `Error.captureStackTrace()`. Si vous ne voyez pas le stack complet :

1. Vérifier que l'exception hérite de `DomainException`
2. Ne pas surcharger le constructeur sans appeler `super()`
3. Utiliser Node.js avec `--stack-trace-limit=50` pour plus de détails

## 📞 Support

Pour toute question ou ajout d'exceptions :
1. Consulter les tests existants
2. Étendre `DomainException`
3. Ajouter tests complets
4. Documenter le code d'erreur

Repository : https://github.com/Dramanable/dvd-test
