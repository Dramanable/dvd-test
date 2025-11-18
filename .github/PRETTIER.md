# 🎨 Prettier - Guide de formatage du code

## Configuration

Le projet utilise **Prettier** pour un formatage de code cohérent et automatique.

### Configuration (`.prettierrc.json`)

```json
{
  "semi": true,              // Point-virgules requis
  "trailingComma": "es5",    // Virgules finales (ES5)
  "singleQuote": true,       // Guillemets simples
  "printWidth": 100,         // Largeur maximale de ligne
  "tabWidth": 2,             // Indentation de 2 espaces
  "useTabs": false,          // Utiliser des espaces
  "arrowParens": "always",   // Parenthèses sur les arrow functions
  "endOfLine": "lf",         // Line endings Unix
  "bracketSpacing": true,    // Espaces dans les objets { foo: bar }
  "bracketSameLine": false   // Chevron fermant sur nouvelle ligne
}
```

## 📝 Scripts npm

| Script | Commande | Description |
|--------|----------|-------------|
| **Format** | `npm run format` | Formate tous les fichiers TypeScript |
| **Check** | `npm run format:check` | Vérifie le formatage sans modifier |

## 🚀 Utilisation

### Formater le code

```bash
# Formater tous les fichiers
npm run format

# Ou avec Make
make format
```

### Vérifier le formatage

```bash
# Vérifier sans modifier
npm run format:check

# Ou avec Make
make format-check
```

## 🔄 Intégration avec ESLint

Prettier est intégré avec ESLint via :
- `eslint-plugin-prettier` : Exécute Prettier comme règle ESLint
- `eslint-config-prettier` : Désactive les règles ESLint conflictuelles

### Configuration ESLint

```javascript
plugins: {
  'prettier': prettierPlugin,
},
rules: {
  'prettier/prettier': 'error',
  ...prettierConfig.rules,
}
```

## 🪝 Git Hooks avec Husky

Le formatage est **automatique** à chaque commit grâce à `lint-staged` :

```json
{
  "lint-staged": {
    "*.ts": [
      "prettier --write",     // 1. Format avec Prettier
      "eslint --fix",         // 2. Lint avec ESLint
      "jest --bail --findRelatedTests"  // 3. Tests
    ]
  }
}
```

### Workflow pre-commit

1. **Vous commitez** : `git commit -m "..."`
2. **Husky intercepte** le commit
3. **lint-staged** s'exécute :
   - ✨ Formate avec Prettier
   - 🔍 Lint avec ESLint
   - ✅ Lance les tests relatifs
4. **Commit validé** si tout passe

## 🎯 Fichiers ignorés

`.prettierignore` exclut certains fichiers :

```
node_modules/
dist/
coverage/
package-lock.json
*.log
```

## 🔧 Configuration IDE

### VS Code

Installez l'extension Prettier et ajoutez à `.vscode/settings.json` :

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### WebStorm / IntelliJ

1. **Settings** → **Languages & Frameworks** → **JavaScript** → **Prettier**
2. Cochez "On save"
3. Sélectionnez le package Prettier du projet

## 📊 Pipeline CI/CD

### GitHub Actions

Le workflow CI vérifie le formatage :

```yaml
format:
  name: Format Check
  runs-on: ubuntu-latest
  steps:
    - name: Check code formatting
      run: npm run format:check
```

Le job **format** s'exécute **avant** le lint et bloque si le code n'est pas formaté.

## ✅ Bonnes pratiques

### ✅ À faire

- Utiliser `npm run format` avant de committer
- Laisser `lint-staged` formater automatiquement
- Configurer votre IDE pour formater à la sauvegarde
- Exécuter `make format` après avoir fusionné des branches

### ❌ À éviter

- Ne pas committer de code non formaté manuellement
- Ne pas désactiver Prettier dans les fichiers (sauf exception)
- Ne pas modifier `.prettierrc.json` sans consensus d'équipe

## 🔍 Vérification manuelle

```bash
# Lister les fichiers mal formatés
npm run format:check

# Exemple de sortie
Checking formatting...
src/domain/entities/Movie.ts
src/index.ts
Code style issues found in 2 files. Run Prettier to fix.

# Corriger automatiquement
npm run format

# Vérifier à nouveau
npm run format:check
All matched files use Prettier code style!
```

## 🎓 Exemples

### Avant Prettier

```typescript
const movies=[{title:"Back to the Future",price:15},{title:"Other",price:20}]

function calculatePrice(items:any){
return items.reduce((sum,item)=>sum+item.price,0)}
```

### Après Prettier

```typescript
const movies = [
  { title: 'Back to the Future', price: 15 },
  { title: 'Other', price: 20 },
];

function calculatePrice(items: any): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

## 📚 Ressources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [Prettier Playground](https://prettier.io/playground/)
- [ESLint + Prettier Integration](https://github.com/prettier/eslint-plugin-prettier)

---

**Note** : Le formatage Prettier est **obligatoire** dans ce projet. Tous les commits doivent respecter les règles de formatage pour passer le CI.
