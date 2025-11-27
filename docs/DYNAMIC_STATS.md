# Documentation - Statistiques Dynamiques

Ce projet utilise un système de **statistiques dynamiques** qui met automatiquement à jour les badges, métriques et documentation avec les vraies valeurs extraites des tests.

## 🎯 Objectif

- ✅ **Cohérence** : Les badges/stats reflètent toujours la réalité
- ✅ **Maintenabilité** : Plus de valeurs hardcodées à maintenir manuellement
- ✅ **Fiabilité** : Impossible d'avoir des statistiques obsolètes
- ✅ **Automatisation** : Intégration dans les workflows CI/CD

## 📊 Scripts Disponibles

### 1. `./scripts/generate-badges.sh`

**Rôle** : Extraire les statistiques actuelles et générer les badges

```bash
./scripts/generate-badges.sh
```

**Sortie** :
- Variables d'environnement exportées (`DYNAMIC_TEST_SUITES`, `DYNAMIC_TESTS_PASSED`, `DYNAMIC_COVERAGE`)
- Badges générés dans `/tmp/dynamic_badges.md`
- Statistiques affichées dans la console

**Extraction** :
- **Tests** : `npm test --silent | grep "Tests:"`
- **Suites** : `npm test --silent | grep "Test Suites:"`  
- **Coverage** : `npm run test:coverage --silent | grep "All files"`

### 2. `./scripts/update-docs-stats.sh`

**Rôle** : Mettre à jour toutes les statistiques dans les fichiers de documentation

```bash
./scripts/update-docs-stats.sh
```

**Fichiers mis à jour** :
- `README.md` - Badges et métriques principales
- `ARCHITECTURE.md` - Stats techniques détaillées  
- `API.md` - Métriques d'API
- `SDK.md` - Stats du SDK
- `validate.sh` - Déjà dynamique

**Transformations** :
- Badges : `tests-259%20passing` → `tests-229%20passing`
- Stats texte : `**259 tests**` → `**229 tests**`
- Pourcentages : `83.72% coverage` → `74.12% coverage`

### 3. `./scripts/ci-update-stats.sh`

**Rôle** : Intégration continue complète avec validation et commit automatique

```bash
./scripts/ci-update-stats.sh
```

**Workflow** :
1. ✅ Exécute `npm test` (doit passer)
2. ✅ Exécute `npm run lint` (doit passer) 
3. 📊 Met à jour toutes les statistiques
4. 🔍 Détecte les changements avec `git diff`
5. 💾 Propose un commit automatique (optionnel)

**Utilisation recommandée** : Avant chaque push vers le repository

## 🔄 Workflow Recommandé

### Développement quotidien

```bash
# Développement normal
npm test
npm run lint

# Avant commit/push
./scripts/ci-update-stats.sh
```

### Release/Publication

```bash
# Validation complète
./validate.sh

# Mise à jour des stats si nécessaire
./scripts/update-docs-stats.sh

# Commit et push
git add -A
git commit -m "🚀 Release v1.x.x with updated stats"
git push
```

## 📝 Exemples Concrets

### Avant (hardcodé)
```markdown
![Tests](https://img.shields.io/badge/tests-259%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-83.72%25-brightgreen)

**259 tests** avec couverture >83%
```

### Après (dynamique)
```markdown
<!-- Badges dynamiques générés par ./scripts/generate-badges.sh -->
![Tests](https://img.shields.io/badge/tests-229%20passing-brightgreen)  
![Coverage](https://img.shields.io/badge/coverage-74.12%25-brightgreen)

**229 tests** avec couverture >74%
```

## ⚠️ Notes Importantes

### CHANGELOG.md - Pas de mise à jour
Le `CHANGELOG.md` contient des **statistiques historiques** qui ne doivent **PAS** être mises à jour car elles reflètent l'état du projet à chaque version.

✅ **Correct** : Garder `v1.0.0 - 102 tests, 92% coverage`
❌ **Incorrect** : Changer en `v1.0.0 - 229 tests, 74% coverage`

### Validation des scripts
Tous les scripts incluent des **validations de cohérence** :

```bash
# Vérifier que les valeurs sont valides
if [ -z "$coverage" ]; then
    echo "❌ Erreur: impossible d'extraire les statistiques"
    exit 1
fi
```

### Intégration GitHub Actions
```yaml
# .github/workflows/ci.yml
- name: Update dynamic statistics
  run: ./scripts/ci-update-stats.sh
```

## 🎉 Bénéfices

1. **Zéro maintenance manuelle** des statistiques
2. **Toujours synchronisé** avec la réalité du code
3. **Détection automatique** des régressions de coverage
4. **Documentation fiable** pour les nouveaux développeurs
5. **Intégration CI/CD** native

---

**Résultat** : Une documentation qui se maintient toute seule ! 🚀