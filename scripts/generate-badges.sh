#!/bin/bash

# Script pour générer des badges dynamiques avec les vraies statistiques
# Utilisation: ./scripts/generate-badges.sh

set -e

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Génération des badges dynamiques...${NC}"

# Fonction pour extraire les statistiques des tests
extract_test_stats() {
    local test_output=$(npm test --silent 2>&1)
    local test_suites=$(echo "$test_output" | grep "Test Suites:" | tail -1 | sed -E 's/.*Test Suites: ([0-9]+) passed, ([0-9]+) total/\1/')
    local tests_passed=$(echo "$test_output" | grep "Tests:" | tail -1 | sed -E 's/.*Tests:[[:space:]]+([0-9]+) passed, ([0-9]+) total/\1/')
    
    echo "$test_suites:$tests_passed"
}

# Fonction pour extraire le taux de couverture  
extract_coverage() {
    local coverage_output=$(npm run test:coverage --silent 2>&1)
    # Extraire le pourcentage de la ligne "All files" (colonne "% Lines")
    local coverage=$(echo "$coverage_output" | grep "All files" | awk -F'|' '{print $5}' | xargs)
    
    if [ -z "$coverage" ]; then
        # Fallback: extraire le dernier pourcentage décimal de la ligne All files
        coverage=$(echo "$coverage_output" | grep "All files" | grep -o '[0-9]\+\.[0-9]\+' | tail -1)
    fi
    
    echo "$coverage"
}

# Extraire les statistiques actuelles
echo -e "${BLUE}📊 Extraction des statistiques...${NC}"

stats=$(extract_test_stats)
test_suites=$(echo "$stats" | cut -d':' -f1)
tests_passed=$(echo "$stats" | cut -d':' -f2)
coverage=$(extract_coverage)

# Vérifier que nous avons des valeurs valides
if [ -z "$test_suites" ] || [ -z "$tests_passed" ] || [ -z "$coverage" ]; then
    echo "❌ Erreur: impossible d'extraire les statistiques"
    echo "Test suites: '$test_suites'"
    echo "Tests passed: '$tests_passed'"
    echo "Coverage: '$coverage'"
    exit 1
fi

echo -e "${GREEN}✅ Statistiques extraites:${NC}"
echo "   - Test suites: $test_suites"
echo "   - Tests passed: $tests_passed"
echo "   - Coverage: $coverage%"

# Générer les badges
generate_badges() {
    cat << EOF
![CI](https://github.com/Dramanable/dvd-test/workflows/CI/badge.svg)
![Tests](https://img.shields.io/badge/tests-${tests_passed}%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-${coverage}%25-brightgreen)
![Node](https://img.shields.io/badge/node-24.x-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.3-blue)
![License](https://img.shields.io/badge/license-ISC-blue)
EOF
}

# Sauvegarder les badges dans un fichier temporaire
badges_file="/tmp/dynamic_badges.md"
generate_badges > "$badges_file"

echo -e "${GREEN}✅ Badges générés dans: $badges_file${NC}"
echo -e "${BLUE}📋 Contenu des badges:${NC}"
cat "$badges_file"

# Export des variables pour utilisation dans d'autres scripts
export DYNAMIC_TEST_SUITES="$test_suites"
export DYNAMIC_TESTS_PASSED="$tests_passed"  
export DYNAMIC_COVERAGE="$coverage"

echo -e "${GREEN}✅ Variables exportées:${NC}"
echo "   - DYNAMIC_TEST_SUITES=$DYNAMIC_TEST_SUITES"
echo "   - DYNAMIC_TESTS_PASSED=$DYNAMIC_TESTS_PASSED"
echo "   - DYNAMIC_COVERAGE=$DYNAMIC_COVERAGE"