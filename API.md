# DVD Calculator REST API

REST API pour le calculateur de prix de DVDs "Back to the Future", construit avec Fastify et Swagger.

## 🚀 Démarrage

### Installation

```bash
npm install
npm run build
```

### Lancement du serveur

```bash
# Production
npm run start:api

# Développement avec rechargement
npm run dev:api
```

Le serveur démarre par défaut sur `http://localhost:5000`.

### Variables d'environnement

```bash
PORT=5000        # Port du serveur (défaut: 5000)
HOST=0.0.0.0     # Host du serveur (défaut: 0.0.0.0)
```

## 📚 Documentation interactive

Une fois le serveur démarré, accédez à la documentation Swagger UI :

```
http://localhost:5000/api/docs
```

La spécification OpenAPI JSON est disponible à :

```
http://localhost:5000/api/docs/json
```

## 🔌 Endpoints

### POST /api/calculate

Calcule le prix total d'une liste de DVDs avec les remises applicables.

**URL** : `/api/calculate`  
**Method** : `POST`  
**Content-Type** : `application/json`

#### Request Body

```json
{
  "movies": [
    "Back to the Future",
    "Back to the Future II",
    "Star Wars"
  ]
}
```

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| movies | string[] | Oui | Liste des titres de films |

#### Response (200 OK)

```json
{
  "total": 52,
  "subtotal": 60,
  "discount": 8,
  "discountPercentage": 13.33,
  "itemCount": 3,
  "uniqueEpisodes": 2,
  "movies": [
    {
      "title": "Back to the Future",
      "type": "BTTF",
      "basePrice": 20,
      "episodeNumber": 1
    },
    {
      "title": "Back to the Future II",
      "type": "BTTF",
      "basePrice": 20,
      "episodeNumber": 2
    },
    {
      "title": "Star Wars",
      "type": "OTHER",
      "basePrice": 20
    }
  ]
}
```

#### Error Responses

**400 Bad Request** - Données invalides

```json
{
  "error": "Bad Request",
  "message": "body must have required property 'movies'"
}
```

**500 Internal Server Error** - Erreur serveur

```json
{
  "error": "Internal Server Error",
  "message": "Error message details"
}
```

### GET /health

Vérifie l'état du serveur.

**URL** : `/health`  
**Method** : `GET`

#### Response (200 OK)

```json
{
  "status": "ok",
  "timestamp": "2024-01-18T10:30:00.000Z",
  "uptime": 123.456
}
```

## 📖 Exemples

### Curl

```bash
# Calculer le prix de 3 DVDs
curl -X POST http://localhost:5000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"movies": ["Back to the Future", "Back to the Future II", "Back to the Future III"]}'

# Health check
curl http://localhost:5000/health
```

### JavaScript (Fetch)

```javascript
const response = await fetch('http://localhost:5000/api/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    movies: [
      'Back to the Future',
      'Back to the Future II',
      'Star Wars'
    ]
  })
});

const result = await response.json();
console.log(result);
```

### Python (requests)

```python
import requests

response = requests.post(
    'http://localhost:5000/api/calculate',
    json={
        'movies': [
            'Back to the Future',
            'Back to the Future II',
            'Star Wars'
        ]
    }
)

result = response.json()
print(result)
```

## 🧪 Tests

Les tests API utilisent l'approche TDD avec Fastify inject :

```bash
# Tous les tests
npm test

# Tests API uniquement
npm test src/api

# Coverage
npm run test:coverage
```

**76 tests** dont **16 tests API** couvrant :
- ✅ Calculs avec remises
- ✅ Validation des entrées
- ✅ Gestion des erreurs
- ✅ Health check
- ✅ Documentation Swagger
- ✅ Support CORS

## 🏗️ Architecture

L'API suit l'architecture Clean Architecture :

```
src/api/
├── __tests__/
│   └── routes.test.ts    # 16 tests TDD
├── index.ts              # Point d'entrée
├── server.ts             # Configuration Fastify
├── routes.ts             # Définition des routes
└── swagger.ts            # Configuration OpenAPI
```

L'API utilise le SDK `DVDCalculator` sous-jacent, maintenant la séparation des responsabilités.

## 🔒 Sécurité

- ✅ CORS activé avec configuration par défaut
- ✅ Validation stricte des entrées avec JSON Schema
- ✅ Gestion d'erreurs robuste
- ✅ Logging avec Pino

## 📊 Règles de remise

Les remises sont calculées automatiquement :

| Épisodes uniques | Remise |
|------------------|--------|
| 2 épisodes       | 10%    |
| 3 épisodes       | 20%    |

**Note** : Les remises s'appliquent uniquement aux films "Back to the Future". Les autres films sont comptés à 20€ sans remise.

## 🐳 Docker

```bash
# Build
docker build -t dvd-calculator-api .

# Run
docker run -p 5000:5000 dvd-calculator-api
```

## 📝 Licence

ISC
