#!/usr/bin/env bash
# Point d'entrée unique des vérifications, utilisé par l'agent, par les
# workflows agent-* et par la CI. Se lance depuis la racine du dépôt.
#
#   bash scripts/agent/run.sh check                    # python manage.py check
#   bash scripts/agent/run.sh migrations               # aucune migration manquante
#   bash scripts/agent/run.sh makemigrations [app]     # génère les migrations
#   bash scripts/agent/run.sh test-api [label…]        # python manage.py test (ex. apps.jobs)
#   bash scripts/agent/run.sh test-web [vitest args]   # ng test --watch=false (frontend/)
#   bash scripts/agent/run.sh build-web                # ng build (production)
#   bash scripts/agent/run.sh all                      # tout, sauf le format
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.."

PYTHON="${PYTHON:-python}"
command -v "$PYTHON" >/dev/null 2>&1 || PYTHON=python3

cmd="${1:-all}"
shift || true

case "$cmd" in
  check) "$PYTHON" manage.py check ;;
  migrations) "$PYTHON" manage.py makemigrations --check --dry-run ;;
  makemigrations) "$PYTHON" manage.py makemigrations "$@" ;;
  test-api) "$PYTHON" manage.py test "$@" ;;
  test-web) (cd frontend && npx ng test --watch=false "$@") ;;
  build-web) (cd frontend && npx ng build) ;;
  all)
    bash "$0" check
    bash "$0" migrations
    bash "$0" test-api
    bash "$0" test-web
    bash "$0" build-web
    ;;
  *)
    echo "Commande inconnue : $cmd" >&2
    exit 2
    ;;
esac
