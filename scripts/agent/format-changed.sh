#!/usr/bin/env bash
# Prettier sur les seuls fichiers du frontend modifiés par rapport à la branche
# de base. Le frontend n'est pas encore entièrement formaté : on ne bloque
# l'agent que sur ce qu'il a touché. Le backend Python n'a pas de formateur
# configuré pour l'instant.
#
# Usage : bash scripts/agent/format-changed.sh [--check|--write]   (défaut : --check)
# Env   : BASE_REF (défaut : origin/main)
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.."

mode="${1:---check}"
base="${BASE_REF:-origin/main}"

mapfile -t files < <(
  {
    git diff --name-only --diff-filter=ACMR "$base" -- frontend 2>/dev/null || true
    git ls-files --others --exclude-standard -- frontend
  } | sort -u | grep -E '\.(ts|html|scss|css|json|md|mjs|js)$' \
    | grep -v '^frontend/package-lock\.json$' | sed 's#^frontend/##' || true
)

if [ "${#files[@]}" -eq 0 ]; then
  echo "Aucun fichier frontend modifié à vérifier."
  exit 0
fi

cd frontend
npx prettier "$mode" --ignore-unknown "${files[@]}"
