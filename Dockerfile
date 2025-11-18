# Stage 1: Build
FROM node:24-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer TOUTES les dépendances (dev + prod) pour le build
RUN npm ci

# Copier le code source
COPY . .

# Compiler le TypeScript
RUN npm run build

# Stage 2: Production
FROM node:24-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer uniquement les dépendances de production
# --ignore-scripts pour éviter l'exécution de husky
RUN npm ci --only=production --ignore-scripts

# Copier les fichiers compilés depuis le stage builder
COPY --from=builder /app/dist ./dist

# Définir l'entrypoint
ENTRYPOINT ["node", "dist/index.js"]

# Par défaut, mode interactif si aucun argument
CMD []
