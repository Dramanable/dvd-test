# Guide de contribution

Merci de contribuer au projet DVD Shop Calculator ! 🎉

## 🚀 Pour commencer

1. **Fork** le repository
2. **Clone** votre fork :
   ```bash
   git clone https://github.com/VOTRE_USERNAME/ekinox.git
   cd ekinox
   ```
3. **Installez** les dépendances :
   ```bash
   make install
   ```

## 🔧 Workflow de développement

### 1. Créer une branche

```bash
git checkout -b feature/ma-fonctionnalite
# ou
git checkout -b fix/mon-correctif
```

### 2. Développer avec TDD

Nous suivons le **Test-Driven Development** :

1. ✍️ **Écrire le test** (rouge)
   ```bash
   # Créer un fichier .test.ts
   npm run test:watch
   ```

2. ✅ **Écrire le code** (vert)
   ```bash
   # Implémenter la fonctionnalité
   npm test
   ```

3. 🔄 **Refactoriser** (propre)
   ```bash
   make lint
   make lint-fix
   ```

### 3. Vérifier la qualité

Avant de commit :

```bash
# Pipeline CI complet
make ci

# Ou étape par étape
make lint          # ESLint
make build         # Compilation
make test          # Tests
make validate      # Validation des exemples
```

### 4. Commit

Utilisez **Commitizen** pour créer des commits sémantiques :

```bash
# Après avoir stagé vos fichiers
make commit

# Suivez les instructions interactives
# Commitizen vous guidera pour créer le commit parfait
```

Format des commits (Conventional Commits) :

```bash
# Format
type(scope): description courte

# Exemples
feat(cart): ajouter calcul de TVA
fix(parser): gérer les lignes vides
docs(readme): ajouter exemples Docker
test(cart): ajouter cas limites
refactor(domain): simplifier Movie entity
```

**Types de commits** :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `test`: Tests
- `refactor`: Refactorisation
- `style`: Formatage
- `perf`: Performance
- `build`: Build/dépendances
- `ci`: CI/CD
- `chore`: Maintenance

Voir [COMMITS.md](./COMMITS.md) pour plus de détails.

### 5. Push et Pull Request

```bash
git push origin feature/ma-fonctionnalite
```

Puis créez une **Pull Request** sur GitHub.

## 📐 Standards de code

### Architecture

Respectez la **Clean Architecture** :

```
domain/          → 0 dépendance externe
application/     → Dépend uniquement de domain/
infrastructure/  → Implémente les ports d'application/
```

### TypeScript

- ✅ **Types explicites** : Toutes les fonctions doivent avoir un type de retour
- ✅ **Pas de `any`** : Utilisez des types précis
- ✅ **Strict mode** : Configuration stricte activée
- ✅ **JSDoc** : Documentez les fonctions publiques

### Tests

- ✅ **Couverture** : Maintenez 100% de couverture
- ✅ **Nommage** : `describe` + `it` clairs
- ✅ **Arrange-Act-Assert** : Structure claire
- ✅ **Un concept par test** : Tests unitaires focalisés

Exemple :

```typescript
describe('Cart', () => {
  it('should apply 20% discount for 3 different BTTF episodes', () => {
    // Arrange
    const cart = new Cart();
    cart.addMovie(new Movie('Back to the Future 1'));
    cart.addMovie(new Movie('Back to the Future 2'));
    cart.addMovie(new Movie('Back to the Future 3'));

    // Act
    const total = cart.calculateTotal();

    // Assert
    expect(total).toBe(36);
  });
});
```

### ESLint

Toutes les règles ESLint doivent passer :

```bash
make lint
```

Si vous devez désactiver une règle, justifiez-le en commentaire :

```typescript
// eslint-disable-next-line no-console
console.log(result); // Affichage du résultat final
```

## 🐛 Signaler un bug

1. Vérifiez que le bug n'est pas déjà signalé
2. Créez une **Issue** avec :
   - Description claire du problème
   - Steps to reproduce
   - Comportement attendu vs. observé
   - Version de Node.js
   - Logs/screenshots si pertinent

## 💡 Proposer une fonctionnalité

1. Créez une **Issue** "Feature Request"
2. Décrivez :
   - Le besoin/problème
   - La solution proposée
   - Les alternatives considérées
   - L'impact sur l'architecture

## 🧪 Tests locaux

### Tests unitaires

```bash
make test              # Tous les tests
npm run test:watch     # Mode watch
make test-coverage     # Avec couverture
```

### Validation complète

```bash
make validate          # Script de validation
make all              # Installation + validation
```

### Tests Docker

```bash
make docker-build
make docker-test
```

## 📝 Documentation

Si vous modifiez le comportement :

- ✅ Mettez à jour le **README.md**
- ✅ Ajoutez des **exemples** si nécessaire
- ✅ Documentez le code avec **JSDoc**
- ✅ Mettez à jour les **tests**

## ✅ Checklist PR

Avant de soumettre votre Pull Request :

- [ ] Les tests passent (`make test`)
- [ ] Le linting passe (`make lint`)
- [ ] Le build fonctionne (`make build`)
- [ ] La validation passe (`make validate`)
- [ ] La couverture est maintenue (100%)
- [ ] La documentation est à jour
- [ ] Les commits sont clairs
- [ ] La branche est à jour avec `main`

## 🔄 Process de revue

1. **Automatique** : GitHub Actions exécute :
   - Linting
   - Tests
   - Build
   - Validation
   - Docker build

2. **Manuelle** : Un mainteneur revoit :
   - Qualité du code
   - Respect de l'architecture
   - Pertinence des tests
   - Documentation

3. **Merge** : Après approbation et passage des CI

## 🎯 Domaines de contribution

### Facile 🟢
- Documentation
- Exemples
- Tests supplémentaires
- Corrections de bugs mineurs

### Moyen 🟡
- Nouvelles règles métier
- Optimisations
- Refactoring
- Amélioration des messages d'erreur

### Avancé 🔴
- Modifications architecturales
- Nouveaux use cases
- Intégration avec d'autres systèmes
- Performance

## 💬 Questions ?

- Créez une **Issue** avec le label "question"
- Ou consultez le **README.md**

## 🙏 Merci !

Votre contribution aide à améliorer ce projet. Merci pour votre temps et votre expertise ! ✨

---

**Happy Coding!** 🚀
