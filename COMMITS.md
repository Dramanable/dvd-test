# 📝 Guide des Commits Sémantiques

Ce projet utilise les **Conventional Commits** pour maintenir un historique Git clair et générer automatiquement les changelogs.

## 🚀 Utilisation rapide

### Avec Commitizen (recommandé)

```bash
# Au lieu de git commit
make commit

# Ou
npm run commit

# Ou
git add .
npx cz
```

Commitizen vous guidera interactivement pour créer le commit parfait ! ✨

### Format manuel

```bash
git commit -m "type(scope): description"
```

## 📋 Types de commits

| Type | Emoji | Description | Exemple |
|------|-------|-------------|---------|
| **feat** | ✨ | Nouvelle fonctionnalité | `feat(cart): ajouter calcul de TVA` |
| **fix** | 🐛 | Correction de bug | `fix(parser): gérer les lignes vides` |
| **docs** | 📚 | Documentation | `docs(readme): ajouter exemples Docker` |
| **style** | 💎 | Formatage, style | `style(domain): formater selon ESLint` |
| **refactor** | ♻️ | Refactorisation | `refactor(cart): simplifier calcul remise` |
| **perf** | ⚡️ | Performance | `perf(parser): optimiser regex` |
| **test** | 🧪 | Tests | `test(cart): ajouter cas limite` |
| **build** | 📦 | Build/dépendances | `build(deps): update typescript to 5.4` |
| **ci** | 🎡 | CI/CD | `ci(github): ajouter workflow release` |
| **chore** | 🔧 | Maintenance | `chore(git): update .gitignore` |
| **revert** | ⏪ | Revert | `revert: feat(cart): remove TVA` |

## 🎯 Scopes disponibles

Les scopes permettent de préciser la partie du projet concernée :

- **domain** : Couche domaine (entités)
- **application** : Couche application (use cases, ports)
- **infrastructure** : Couche infrastructure (adapters)
- **cli** : Interface en ligne de commande
- **tests** : Tests
- **docs** : Documentation
- **config** : Configuration (tsconfig, eslint, etc.)
- **ci** : CI/CD
- **docker** : Docker

Vous pouvez aussi utiliser un scope personnalisé !

## 📝 Structure d'un commit

### Format complet

```
type(scope): description courte (max 100 caractères)

[body optionnel : description détaillée]
- Utilisez le présent : "ajoute" pas "ajouté"
- Soyez clair et concis
- Expliquez le POURQUOI pas le COMMENT

[footer optionnel]
BREAKING CHANGE: description du changement cassant
CLOSES: #123, #456
```

### Exemples

#### Nouvelle fonctionnalité

```bash
feat(cart): ajouter support des codes promo

Permet aux utilisateurs d'appliquer des codes promo
en plus des réductions automatiques.

CLOSES: #45
```

#### Correction de bug

```bash
fix(parser): gérer correctement les accents

Le parser échouait sur les titres avec accents.
Ajout de normalisation Unicode.

CLOSES: #78
```

#### Documentation

```bash
docs(readme): ajouter section Docker Compose

Documente l'utilisation de docker-compose pour
faciliter le déploiement local.
```

#### Breaking change

```bash
feat(api)!: changer format retour API

BREAKING CHANGE: L'API retourne maintenant un objet
au lieu d'un nombre simple. Migrer avec :
{ total: 36 } au lieu de 36
```

## 🔧 Git Hooks

Ce projet utilise **Husky** pour automatiser les vérifications :

### Pre-commit Hook

Avant chaque commit :
- ✅ **ESLint** : Vérifie et corrige automatiquement le code
- ✅ **Tests** : Lance les tests liés aux fichiers modifiés

### Commit-msg Hook

Vérifie que le message de commit respecte le format :
- ✅ Type valide
- ✅ Format correct
- ✅ Longueur du sujet ≤ 100 caractères

Si le commit ne respecte pas le format, il sera **rejeté** !

## ✅ Bonnes pratiques

### DO ✅

```bash
# Bon : description claire et impérative
feat(cart): ajouter support multi-devises

# Bon : scope précis
fix(parser): corriger parsing des titres longs

# Bon : breaking change clairement marqué
feat(api)!: changer signature calculate()

# Bon : référence aux issues
fix(cart): corriger calcul remise
CLOSES: #123
```

### DON'T ❌

```bash
# Mauvais : pas de type
git commit -m "ajout d'une nouvelle fonctionnalité"

# Mauvais : description vague
git commit -m "fix: corrections"

# Mauvais : passé composé
git commit -m "feat: ajouté support Docker"

# Mauvais : trop long
git commit -m "feat(cart): ajouter une nouvelle fonctionnalité super importante qui permet de calculer les remises avec un nouveau système très complexe"
```

## 🎓 Workflow complet

### 1. Faire vos modifications

```bash
# Travaillez sur votre code
vim src/domain/entities/Cart.ts

# Ajoutez des tests
vim src/domain/entities/Cart.test.ts
```

### 2. Vérifier localement

```bash
make lint       # Vérifier ESLint
make test       # Lancer les tests
make ci         # Pipeline complet
```

### 3. Stager les fichiers

```bash
git add src/domain/entities/Cart.ts
git add src/domain/entities/Cart.test.ts
```

### 4. Commiter avec Commitizen

```bash
make commit
# Suivez les instructions interactives
```

### 5. Pousser

```bash
git push origin ma-branche
```

## 🔍 Vérifier l'historique

### Voir les commits formatés

```bash
git log --oneline --decorate --graph
```

### Filtrer par type

```bash
# Toutes les features
git log --oneline --grep="^feat"

# Tous les bugs corrigés
git log --oneline --grep="^fix"
```

## 📊 Avantages

Les commits sémantiques permettent :

1. ✅ **Historique clair** : Comprendre rapidement les changements
2. ✅ **Changelog automatique** : Génération automatisée
3. ✅ **Versioning sémantique** : Détecter automatiquement les versions
4. ✅ **Meilleure collaboration** : Standard compris par tous
5. ✅ **CI/CD amélioré** : Déclenchement conditionnel selon le type

## 🛠️ Configuration

### Désactiver temporairement les hooks

```bash
# Désactiver pour un commit
git commit --no-verify -m "chore: emergency fix"

# Désactiver Husky complètement
export HUSKY=0
```

### Modifier les règles

Éditez `commitlint.config.js` :

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 120], // Augmenter la limite
  },
};
```

## 📚 Ressources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitizen](https://github.com/commitizen/cz-cli)
- [Commitlint](https://commitlint.js.org/)
- [Husky](https://typicode.github.io/husky/)

## 🆘 Aide

### Le commit est rejeté ?

```bash
# Vérifier le format
npx commitlint --edit

# Voir les règles
npx commitlint --print-config
```

### Tester commitlint

```bash
echo "feat: test message" | npx commitlint
echo "wrong format" | npx commitlint
```

### Déboguer Husky

```bash
# Voir les hooks installés
ls -la .husky/

# Tester manuellement
sh .husky/pre-commit
```

## 🎉 Exemples réels du projet

```bash
# Initial setup
feat(project): initialize TypeScript project with Clean Architecture

# Add feature
feat(domain): implement Cart entity with discount calculation

# Fix bug
fix(parser): handle empty lines in input

# Add tests
test(cart): add edge cases for 3 episodes discount

# Update docs
docs(readme): add Docker installation guide

# CI/CD
ci(github): add automated release workflow

# Refactor
refactor(use-case): extract movie parsing logic

# Performance
perf(cart): optimize discount calculation algorithm
```

---

**Happy Committing!** 🚀✨

