#!/bin/bash

# Script pour mettre à jour les statistiques dynamiquement dans tous les fichiers .md
# Utilisation: ./scripts/update-docs-stats.sh

set -e

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Mise à jour des statistiques dans la documentation...${NC}"

# Sourcer le script de génération de badges pour obtenir les variables
source ./scripts/generate-badges.sh >/dev/null 2>&1

# Vérifier que les variables sont définies
if [ -z "$DYNAMIC_TEST_SUITES" ] || [ -z "$DYNAMIC_TESTS_PASSED" ] || [ -z "$DYNAMIC_COVERAGE" ]; then
    echo -e "${YELLOW}⚠️  Régénération des statistiques...${NC}"
    ./scripts/generate-badges.sh >/dev/null 2>&1
    source ./scripts/generate-badges.sh >/dev/null 2>&1
fi

echo -e "${GREEN}📊 Statistiques actuelles:${NC}"
echo "   - Test suites: $DYNAMIC_TEST_SUITES"
echo "   - Tests passed: $DYNAMIC_TESTS_PASSED" 
echo "   - Coverage: $DYNAMIC_COVERAGE%"

# Fonction pour mettre à jour un fichier
update_file_stats() {
    local file="$1"
    local temp_file="/tmp/$(basename "$file").tmp"
    
    if [ ! -f "$file" ]; then
        echo "   ⚠️  Fichier non trouvé: $file"
        return
    fi
    
    echo "   📝 Mise à jour: $file"
    
    # Remplacer les badges dans le fichier
    sed -E \
        -e "s/tests-[0-9]+%20passing/tests-${DYNAMIC_TESTS_PASSED}%20passing/g" \
        -e "s/coverage-[0-9]+\.[0-9]+%25/coverage-${DYNAMIC_COVERAGE}%25/g" \
        -e "s/\*\*[0-9]+ tests\*\*/**${DYNAMIC_TESTS_PASSED} tests**/g" \
        -e "s/[0-9]+ tests avec couverture >[0-9]+%/${DYNAMIC_TESTS_PASSED} tests avec couverture >${DYNAMIC_COVERAGE%.*}%/g" \
        -e "s/\*\*[0-9]+\.[0-9]+% coverage\*\*/**${DYNAMIC_COVERAGE}% coverage**/g" \
        -e "s/- [0-9]+ tests /- ${DYNAMIC_TESTS_PASSED} tests /g" \
        -e "s/: [0-9]+ tests/: ${DYNAMIC_TESTS_PASSED} tests/g" \
        -e "s/- [0-9]+ suites/- ${DYNAMIC_TEST_SUITES} suites/g" \
        -e "s/Test suites: [0-9]+/Test suites: ${DYNAMIC_TEST_SUITES}/g" \
        "$file" > "$temp_file"
    
    # Vérifier si des changements ont été apportés
    if ! cmp -s "$file" "$temp_file"; then
        mv "$temp_file" "$file"
        echo "       ✅ Mis à jour"
    else
        rm "$temp_file"
        echo "       ➖ Aucun changement"
    fi
}

# Liste des fichiers à mettre à jour
files_to_update=(
    "README.md"
    "ARCHITECTURE.md" 
    "API.md"
    "SDK.md"
    "CHANGELOG.md"
)

echo -e "${BLUE}📄 Mise à jour des fichiers...${NC}"

for file in "${files_to_update[@]}"; do
    update_file_stats "$file"
done

echo -e "${GREEN}✅ Mise à jour terminée !${NC}"

# Régénérer les badges pour le README
echo -e "${BLUE}🔄 Régénération des badges pour README.md...${NC}"
badges_content=$(cat /tmp/dynamic_badges.md 2>/dev/null || ./scripts/generate-badges.sh | tail -6)

# Remplacer les badges dans le README
temp_readme="/tmp/README.md.tmp"
head -2 README.md > "$temp_readme"
echo "<!-- Badges dynamiques générés par ./scripts/generate-badges.sh -->" >> "$temp_readme"
echo "$badges_content" | tail -6 >> "$temp_readme"
tail -n +9 README.md >> "$temp_readme"

if ! cmp -s README.md "$temp_readme"; then
    mv "$temp_readme" README.md
    echo -e "${GREEN}✅ Badges mis à jour dans README.md${NC}"
else
    rm "$temp_readme"
    echo -e "${BLUE}➖ Badges déjà à jour${NC}"
fi

echo -e "${GREEN}🎉 Toutes les statistiques ont été mises à jour !${NC}"