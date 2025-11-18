# Configuration Guide

Guide de configuration pour le DVD Calculator (CLI + SDK + API REST).

## 📦 Structure du projet

```
ekinox/
├── src/
│   ├── api/              # API REST (Fastify + Swagger)
│   ├── sdk/              # SDK programmatique
│   ├── domain/           # Entités métier
│   ├── application/      # Cas d'usage
│   ├── infrastructure/   # Implémentation technique
│   └── index.ts          # CLI
├── examples/             # Exemples de fichiers d'entrée
├── .env.example          # Template des variables d'environnement
├── API.md                # Documentation de l'API REST
└── README.md             # Documentation principale
```

## ⚙️ Variables d'environnement

### Configuration de l'API REST

Le projet utilise des variables d'environnement pour configurer l'API REST.

#### Copier le template

```bash
cp .env.example .env
```

#### Variables disponibles

| Variable | Défaut | Description |
|----------|--------|-------------|
| `PORT` | `5000` | Port d'écoute de l'API REST |
| `HOST` | `0.0.0.0` | Adresse d'écoute (0.0.0.0 = toutes les interfaces) |
| `NODE_ENV` | `development` | Environment (development, production, test) |

#### Exemple de fichier .env

```bash
# API Configuration
PORT=5000
HOST=0.0.0.0
NODE_ENV=development
```

## 🚀 Modes d'utilisation

### 1. CLI (Interface en ligne de commande)

```bash
# Avec un fichier
npm run dev examples/example1.txt

# Production
npm start examples/example1.txt

# Après build
node dist/index.js examples/example1.txt
```

### 2. SDK (Utilisation programmatique)

```typescript
import { DVDCalculator } from 'dvd-shop-calculator';

const calculator = new DVDCalculator();
const result = calculator.calculate([
  'Back to the Future',
  'Back to the Future II'
]);

console.log(result); // 27
```

### 3. API REST (Serveur HTTP)

```bash
# Mode développement (avec rechargement automatique)
npm run dev:api

# Mode production
npm run build
npm run start:api

# Avec variables d'environnement personnalisées
PORT=8080 HOST=localhost npm run dev:api
```

L'API sera accessible à :
- Documentation Swagger : `http://localhost:5000/api/docs`
- Endpoint de calcul : `http://localhost:5000/api/calculate`
- Health check : `http://localhost:5000/health`

## 🐳 Docker

### Variables d'environnement avec Docker

```bash
# Avec port personnalisé
docker run -p 8080:8080 -e PORT=8080 dvd-calculator-api

# Avec fichier .env
docker run --env-file .env -p 5000:5000 dvd-calculator-api
```

### Docker Compose (à venir)

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - HOST=0.0.0.0
      - NODE_ENV=production
```

## 🔧 Configuration du développement

### Node.js & npm

**Versions requises :**
- Node.js >= 24.0.0
- npm >= 10.0.0

Vérification :
```bash
node --version  # doit afficher v24.x.x ou supérieur
npm --version   # doit afficher 10.x.x ou supérieur
```

### TypeScript

Configuration dans `tsconfig.json` :
- Mode strict activé
- Target ES2022
- Module CommonJS
- Source maps activés

### ESLint

Configuration stricte :
- Pas de `any` autorisé
- TypeScript strict
- Prettier intégré

```bash
npm run lint        # Vérification
npm run lint:fix    # Correction automatique
```

### Prettier

Formatage automatique du code :

```bash
npm run format         # Formater
npm run format:check   # Vérifier sans modifier
```

### Git Hooks (Husky)

Hooks automatiques configurés :
- **pre-commit** : lint-staged (lint + format + tests des fichiers modifiés)
- **commit-msg** : commitlint (validation des messages conventionnels)

## 📊 Scripts npm disponibles

### Build & Exécution

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript → JavaScript (dist/) |
| `npm start` | Lance le CLI (nécessite un fichier en argument) |
| `npm run dev` | Lance le CLI en mode développement |
| `npm run start:api` | Lance l'API REST (mode production) |
| `npm run dev:api` | Lance l'API REST (mode développement) |

### Tests

| Script | Description |
|--------|-------------|
| `npm test` | Lance tous les tests (76 tests) |
| `npm run test:watch` | Tests en mode watch |
| `npm run test:coverage` | Tests avec rapport de couverture |

### Qualité du code

| Script | Description |
|--------|-------------|
| `npm run lint` | Vérification ESLint |
| `npm run lint:fix` | Correction automatique ESLint |
| `npm run format` | Formatage Prettier |
| `npm run format:check` | Vérification Prettier |

### Git

| Script | Description |
|--------|-------------|
| `npm run commit` | Commit interactif (Commitizen) |

## 🌐 Configuration de production

### Recommandations

1. **Variables d'environnement**
   ```bash
   NODE_ENV=production
   PORT=5000
   HOST=0.0.0.0
   ```

2. **Build optimisé**
   ```bash
   npm run build
   ```

3. **Process manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start dist/api/index.js --name dvd-api
   ```

4. **Reverse proxy (Nginx)**
   ```nginx
   location /api {
     proxy_pass http://localhost:5000;
     proxy_http_version 1.1;
     proxy_set_header Upgrade $http_upgrade;
     proxy_set_header Connection 'upgrade';
     proxy_set_header Host $host;
     proxy_cache_bypass $http_upgrade;
   }
   ```

## 🔒 Sécurité

### En production

- ✅ CORS configuré (à restreindre selon besoins)
- ✅ Validation stricte des entrées (JSON Schema)
- ✅ Gestion d'erreurs robuste
- ✅ Logging avec Pino
- ⚠️ À ajouter : Rate limiting
- ⚠️ À ajouter : Authentication/Authorization
- ⚠️ À ajouter : HTTPS

### Bonnes pratiques

1. Ne jamais commiter le fichier `.env`
2. Utiliser des secrets pour les clés sensibles
3. Mettre à jour régulièrement les dépendances
4. Monitorer les logs en production

## 📚 Ressources

- [API Documentation](./API.md) - Guide complet de l'API REST
- [README](./README.md) - Documentation principale
- [Cahier des charges](./cahier_de_charge.txt) - Spécifications métier
- [Fastify Documentation](https://www.fastify.io/) - Framework web
- [Swagger/OpenAPI](https://swagger.io/) - Documentation API

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation
2. Consulter les issues GitHub
3. Ouvrir une nouvelle issue si nécessaire

Repository : https://github.com/Dramanable/dvd-test
