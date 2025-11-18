# GitHub Actions CI/CD

Ce projet utilise GitHub Actions pour l'intégration et le déploiement continus.

## 📋 Workflows disponibles

### 1. CI Pipeline (`ci.yml`)

**Déclenchement** : Push ou Pull Request sur `main`, `master`, `develop`

**Jobs** :

#### Lint
- Installation des dépendances
- Vérification ESLint
- **Durée estimée** : ~30s

#### Test
- Exécution des 34 tests unitaires
- Génération du rapport de couverture
- Upload vers Codecov (optionnel)
- **Durée estimée** : ~1min

#### Build
- Compilation TypeScript
- Upload des artifacts (dossier `dist/`)
- **Durée estimée** : ~30s

#### Validate
- Exécution du script de validation
- Test des 5 exemples
- **Durée estimée** : ~40s
- **Dépend de** : lint, test, build

#### Docker
- Build de l'image Docker
- Test de l'image avec example1.txt
- Mise en cache des layers
- **Durée estimée** : ~2min
- **Dépend de** : lint, test, build

**Durée totale** : ~3-4 minutes

### 2. Release Pipeline (`release.yml`)

**Déclenchement** : Push d'un tag `v*` (ex: `v1.0.0`)

**Jobs** :

#### Release
1. Exécute les tests
2. Build le projet
3. Validation complète
4. Création d'une archive `.tar.gz`
5. Création d'une GitHub Release
6. Notes de release automatiques

#### Docker Publish
1. Build de l'image Docker
2. Tag avec versions sémantiques
3. Publication sur Docker Hub (si configuré)

**Prérequis** :
- Secrets GitHub : `DOCKER_USERNAME`, `DOCKER_PASSWORD`

**Exemple de tag** :
```bash
git tag v1.0.0
git push origin v1.0.0
```

### 3. Dependency Review (`dependency-review.yml`)

**Déclenchement** : Pull Request vers `main` ou `master`

**Jobs** :

#### Dependency Review
- Analyse des nouvelles dépendances
- Détection de vulnérabilités
- Commentaire automatique sur la PR

#### Security Audit
- `npm audit` avec niveau modéré
- Continue même en cas d'erreurs (non bloquant)

## 🔧 Configuration

### Secrets GitHub

Pour activer toutes les fonctionnalités, configurez ces secrets dans :
`Settings > Secrets and variables > Actions`

| Secret | Description | Requis |
|--------|-------------|---------|
| `DOCKER_USERNAME` | Nom d'utilisateur Docker Hub | Pour publication Docker |
| `DOCKER_PASSWORD` | Token/mot de passe Docker Hub | Pour publication Docker |
| `CODECOV_TOKEN` | Token Codecov | Pour upload coverage (optionnel) |

### Variables d'environnement

Aucune variable d'environnement requise pour le moment.

## 📊 Status Badges

Ajoutez ces badges à votre README (remplacez `USERNAME` et `REPO`) :

```markdown
![CI](https://github.com/USERNAME/REPO/workflows/CI/badge.svg)
![Release](https://github.com/USERNAME/REPO/workflows/Release/badge.svg)
```

## 🚀 Utilisation

### Développement normal

1. Créez une branche
2. Committez vos changements
3. Pushez vers GitHub
4. **CI s'exécute automatiquement**
5. Créez une Pull Request
6. **CI + Dependency Review s'exécutent**
7. Merge après approbation

### Créer une release

```bash
# 1. Mettez à jour la version dans package.json
npm version patch  # ou minor, ou major

# 2. Poussez le tag
git push origin main --tags

# 3. Le workflow Release se déclenche automatiquement
```

## 🔍 Debugging

### Workflow échoue

1. Cliquez sur l'onglet **Actions** de votre repo
2. Sélectionnez le workflow qui a échoué
3. Cliquez sur le job en erreur
4. Consultez les logs détaillés

### Reproduire localement

Tous les workflows peuvent être reproduits localement :

```bash
# CI Pipeline
make ci

# Validation (partie de Release)
make validate

# Docker build
make docker-build
make docker-test
```

### Logs détaillés

Pour plus de détails sur un job :

```bash
# Installer act (pour exécuter GitHub Actions localement)
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Exécuter un workflow localement
act -W .github/workflows/ci.yml
```

## 📈 Optimisations

### Cache NPM

Les workflows utilisent le cache npm pour accélérer l'installation :

```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

### Cache Docker

Les builds Docker utilisent GitHub Actions cache :

```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

### Parallélisation

Les jobs indépendants s'exécutent en parallèle :
- `lint`, `test`, `build` sont parallèles
- `validate` et `docker` attendent les 3 premiers

## 🛡️ Sécurité

### Dépendances

- **Dependency Review** : Analyse automatique sur PR
- **npm audit** : Vérification des vulnérabilités
- Niveau de sévérité : `moderate` minimum

### Docker

- Image de base officielle : `node:24-alpine`
- Scan de sécurité : Ajoutez Trivy pour scanner l'image

```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: dvd-calculator:latest
```

## 📝 Personnalisation

### Ajouter un job

Éditez `.github/workflows/ci.yml` :

```yaml
my-custom-job:
  name: My Custom Job
  runs-on: ubuntu-latest
  needs: [test]  # Optionnel : attendre d'autres jobs
  
  steps:
  - uses: actions/checkout@v4
  - name: My custom step
    run: echo "Hello World"
```

### Changer les branches

Modifiez les triggers :

```yaml
on:
  push:
    branches: [ main, dev, staging ]
```

### Notifications

Ajoutez des notifications Slack/Discord :

```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🎯 Métriques

### Coverage

Le coverage est uploadé vers Codecov automatiquement.

Badge à ajouter :
```markdown
[![codecov](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USERNAME/REPO)
```

### Performance

Consultez les **Insights > Actions** pour voir :
- Durée des workflows
- Taux de réussite
- Tendances

## 🔄 Maintenance

### Mise à jour des actions

GitHub Actions se met à jour automatiquement mais vérifiez régulièrement :

```bash
# Dépendabot peut créer des PR automatiques
# Configurez .github/dependabot.yml
```

### Nettoyage

Les artifacts sont conservés 90 jours par défaut.
Configurez dans `Settings > Actions > General`.

## 📚 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Action Marketplace](https://github.com/marketplace?type=actions)

---

**Questions ?** Ouvrez une issue avec le label `ci/cd` ! 🚀
