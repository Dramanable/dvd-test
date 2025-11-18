# 🎯 Quick Reference - Commits Sémantiques

## 🚀 Commande rapide

```bash
make commit
```

## 📋 Types (les plus utilisés)

```bash
feat(scope): description     # ✨ Nouvelle fonctionnalité
fix(scope): description      # 🐛 Correction de bug
docs(scope): description     # 📚 Documentation
test(scope): description     # 🧪 Tests
refactor(scope): description # ♻️  Refactorisation
```

## 🎯 Scopes

```
domain | application | infrastructure | cli | tests | docs | config | ci | docker
```

## ✅ Exemples valides

```bash
feat(cart): add discount calculation
fix(parser): handle empty lines
docs(readme): add Docker examples
test(cart): add edge cases
refactor(domain): simplify Movie entity
ci(github): add release workflow
build(deps): update typescript to 5.4
chore(git): update .gitignore
```

## ❌ Exemples invalides

```bash
❌ ajout d'une feature          # Pas de type
❌ feat ajout discount          # Manque ':'
❌ FIX(cart): bug              # Type en majuscule
❌ feat(cart) ajout discount   # Manque ':'
```

## 📏 Règles

- ✅ Type en minuscule
- ✅ Scope optionnel entre parenthèses
- ✅ Description impérative (ajouter, corriger, pas "ajouté")
- ✅ Max 100 caractères pour le sujet
- ✅ Pas de point final

## 🔧 Hooks Git

### Pre-commit
- Lint automatique (ESLint)
- Tests des fichiers modifiés

### Commit-msg
- Validation du format du commit

## 🆘 Contourner les hooks (urgence)

```bash
git commit --no-verify -m "fix: emergency"
```

## 📚 Documentation complète

Voir [COMMITS.md](./COMMITS.md)

---

**Tip**: Utilisez toujours `make commit` pour être guidé ! ✨
