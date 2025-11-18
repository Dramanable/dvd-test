# Docker Deployment

Ce projet fournit deux images Docker :

## 🖥️ CLI Docker

Build et exécution du calculateur en mode CLI :

```bash
# Build l'image
docker build -t dvd-calculator .

# Utilisation avec pipe (recommandé)
echo -e "Back to the Future 1\nBack to the Future 2\nBack to the Future 3" | docker run -i dvd-calculator

# Résultat attendu : 36
```

### Exemples

```bash
# 3 films BTTF différents (20% de réduction)
echo -e "Back to the Future 1\nBack to the Future 2\nBack to the Future 3" | docker run -i dvd-calculator
# → 36

# 2 films BTTF différents (10% de réduction)
echo -e "Back to the Future 1\nBack to the Future 2" | docker run -i dvd-calculator
# → 27

# 1 film BTTF (pas de réduction)
echo "Back to the Future 1" | docker run -i dvd-calculator
# → 15
```

## 🌐 API Docker

Build et exécution de l'API REST :

```bash
# Build l'image API
docker build -f Dockerfile.api -t dvd-calculator-api .

# Lancer le serveur API
docker run -p 3000:3000 dvd-calculator-api

# Tester l'API
curl -X POST http://localhost:3000/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{"movies": ["Back to the Future 1", "Back to the Future 2", "Back to the Future 3"]}'

# Résultat attendu :
# {"total":36,"subtotal":45,"discountPercentage":20,"itemCount":3,"uniqueEpisodes":3,"movies":[...]}
```

### API Endpoints

- **POST** `/v1/calculate` - Calcule le prix total des DVDs
- **GET** `/v1/health` - Status de santé de l'API
- **GET** `/api/docs` - Documentation Swagger UI
- **GET** `/api/docs/json` - Spécification OpenAPI JSON

### Variables d'environnement

```bash
# Personnaliser le port
docker run -p 8080:8080 -e PORT=8080 dvd-calculator-api

# Mode production (défaut)
docker run -e NODE_ENV=production dvd-calculator-api
```

## 📦 Docker Compose (recommandé)

Créez un fichier `docker-compose.yml` :

```yaml
version: '3.8'

services:
  # API REST
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # CLI (pour démonstration)
  cli:
    build:
      context: .
      dockerfile: Dockerfile
    stdin_open: true
    tty: true
```

Lancer avec Docker Compose :

```bash
# Démarrer l'API
docker-compose up api

# Utiliser le CLI
echo -e "Back to the Future 1\nBack to the Future 2" | docker-compose run --rm cli
```

## 🚀 Production Deployment

### Optimisations

Les images utilisent :
- **Multi-stage build** : séparation build/runtime pour réduire la taille
- **Alpine Linux** : image de base légère
- **Production dependencies only** : pas de devDependencies en runtime
- **Non-root user** : sécurité renforcée

### Tailles d'images

- CLI : ~200 MB
- API : ~200 MB

### Sécurité

```bash
# Scanner les vulnérabilités
docker scan dvd-calculator
docker scan dvd-calculator-api

# Mettre à jour les dépendances
npm audit fix
docker build --no-cache -t dvd-calculator .
```

## 🔧 Troubleshooting

### Problème : "Cannot find module"

```bash
# Rebuilder sans cache
docker build --no-cache -t dvd-calculator .
```

### Problème : Port déjà utilisé

```bash
# Utiliser un autre port
docker run -p 8080:3000 dvd-calculator-api
```

### Logs

```bash
# Voir les logs
docker logs <container-id>

# Suivre les logs en temps réel
docker logs -f <container-id>
```
