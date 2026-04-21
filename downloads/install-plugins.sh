#!/bin/bash
# install-plugins.sh — Installe mes 6 plugins Claude Code officiels
# https://jeremysagnier.com/claude-code.html#plugins
#
# Usage :
#   bash install-plugins.sh
# ou :
#   chmod +x install-plugins.sh && ./install-plugins.sh
#
# Ce script installe les 6 plugins Anthropic officiels que j'utilise au quotidien,
# depuis le marketplace `claude-plugins-official` (pré-configuré dans Claude Code).
# Scope user · actif sur tous tes projets.

set -e

# Couleurs pour un feedback lisible
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}━━━ Installation des 6 plugins Claude Code ━━━${NC}"
echo ""

# Vérifie que Claude Code est installé
if ! command -v claude &> /dev/null; then
  echo -e "${RED}× La commande 'claude' n'est pas trouvée.${NC}"
  echo "   Installe d'abord Claude Code : https://claude.com/download"
  echo "   Puis relance ce script."
  exit 1
fi

# Liste des plugins (nom · description courte)
PLUGINS=(
  "superpowers|Méthodologie de dev · 14 skills + 3 commandes slash (/brainstorm, /write-plan, /execute-plan)"
  "context7|Docs à jour de n'importe quel framework via un MCP server"
  "claude-md-management|Audite et améliore les CLAUDE.md · commande /revise-claude-md"
  "frontend-design|Génère des interfaces UI production-grade · auto-déclenché"
  "code-review|Review multi-agents avant commit · commande /code-review"
  "code-simplifier|Simplifie le code récemment modifié · agent auto"
)

COUNT=${#PLUGINS[@]}
CURRENT=0
FAILED=0

for entry in "${PLUGINS[@]}"; do
  CURRENT=$((CURRENT + 1))
  name="${entry%%|*}"
  desc="${entry##*|}"

  echo -e "${YELLOW}[${CURRENT}/${COUNT}]${NC} ${BLUE}${name}${NC}"
  echo "    ${desc}"

  if claude plugin install "${name}" 2>&1 | tail -1; then
    echo -e "    ${GREEN}✓ installé${NC}"
  else
    echo -e "    ${RED}× échec · tu peux relancer manuellement : claude plugin install ${name}${NC}"
    FAILED=$((FAILED + 1))
  fi
  echo ""
done

echo -e "${BLUE}━━━ Fini ━━━${NC}"
if [ "$FAILED" -eq 0 ]; then
  echo -e "${GREEN}✓ Les ${COUNT} plugins sont installés.${NC}"
else
  echo -e "${YELLOW}⚠ ${FAILED} plugin(s) ont échoué, les autres sont OK.${NC}"
fi

echo ""
echo "Prochaines étapes :"
echo "  1. Redémarre Claude Code (ferme et rouvre) pour charger les commandes slash."
echo "  2. Vérifie l'état : claude plugin list"
echo "  3. Teste une commande : /brainstorm ou /revise-claude-md"
echo ""
echo "Pour désactiver un plugin sans désinstaller : claude plugin disable <nom>"
echo "Pour en savoir plus : https://jeremysagnier.com/claude-code.html#plugins"
