# Utilisez l'image officielle Node.js 24
FROM node:24-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Compiler le TypeScript
RUN npm run build

# Définir l'entrypoint
ENTRYPOINT ["node", "dist/index.js"]

# Par défaut, mode interactif si aucun argument
CMD []
