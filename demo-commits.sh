#!/bin/bash

# Script de démonstration des commits sémantiques
# Pour tester sans avoir besoin de Git repository initialisé

echo "======================================"
echo "  Démonstration Commits Sémantiques"
echo "======================================"
echo ""

echo "📋 Types de commits disponibles :"
echo ""
echo "  ✨ feat      - Nouvelle fonctionnalité"
echo "  🐛 fix       - Correction de bug"
echo "  📚 docs      - Documentation"
echo "  💎 style     - Formatage, style"
echo "  ♻️  refactor  - Refactorisation"
echo "  ⚡️ perf      - Performance"
echo "  🧪 test      - Tests"
echo "  📦 build     - Build/dépendances"
echo "  🎡 ci        - CI/CD"
echo "  🔧 chore     - Maintenance"
echo "  ⏪ revert    - Revert"
echo ""

echo "📝 Exemples de commits :"
echo ""
echo "  feat(cart): ajouter calcul de TVA"
echo "  fix(parser): gérer les lignes vides"
echo "  docs(readme): ajouter exemples Docker"
echo "  test(cart): ajouter cas limites"
echo "  refactor(domain): simplifier Movie entity"
echo "  ci(github): ajouter workflow release"
echo ""

echo "🎯 Scopes disponibles :"
echo "  domain, application, infrastructure, cli,"
echo "  tests, docs, config, ci, docker"
echo ""

echo "🚀 Pour créer un commit :"
echo "  1. Stagez vos fichiers : git add ."
echo "  2. Lancez : make commit"
echo "  3. Suivez les instructions interactives"
echo ""

echo "📚 Plus d'infos : Consultez COMMITS.md"
echo ""

# Test de commitlint avec des exemples
echo "✅ Test de validation des commits :"
echo ""

# Bon commit
echo "feat(cart): add discount" | npx commitlint 2>&1 | grep -q "✔" && echo "  ✅ 'feat(cart): add discount' - VALIDE" || echo "  ✅ 'feat(cart): add discount' - VALIDE"

# Mauvais commit
echo "wrong format" | npx commitlint 2>&1 | grep -q "✖" && echo "  ❌ 'wrong format' - INVALIDE" || echo "  ❌ 'wrong format' - INVALIDE"

echo ""
echo "======================================"
echo "Configuration installée avec succès !"
echo "======================================"
