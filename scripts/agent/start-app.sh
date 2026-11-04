#!/usr/bin/env bash
# Démarre l'app pour les agents (MCP Playwright) en arrière-plan :
#   - API Django sur :8000 (SQLite locale `db.sqlite3`, ignorée par git),
#     migrée, avec un compte de test créé à chaque lancement ;
#   - ng serve (configuration de dev, API sur http://localhost:8000/api) sur :4200.
# Attend que les deux répondent. Logs dans .agent-out/*.log.
#
# Identifiants du compte de test : .agent-out/test-user.md (mot de passe
# aléatoire, propre au run ; à ne jamais recopier dans la PR).
#
# Pas de clé OpenAI : les fonctions IA (analyse, matching, lettre de motivation,
# préparation d'entretien) répondent en erreur dans cet environnement.
#
# Prérequis : pip install -r requirements.txt et npm ci --prefix frontend.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.."

PYTHON="${PYTHON:-python}"
command -v "$PYTHON" >/dev/null 2>&1 || PYTHON=python3

out=.agent-out
mkdir -p "$out/playwright"

"$PYTHON" manage.py migrate --noinput > "$out/migrate.log" 2>&1

user="${AGENT_TEST_USER:-agent}"
password="${AGENT_TEST_PASSWORD:-$(openssl rand -hex 12)}"
AGENT_TEST_USER="$user" AGENT_TEST_PASSWORD="$password" "$PYTHON" manage.py shell -c "
import os
from django.contrib.auth.models import User
u, _ = User.objects.get_or_create(username=os.environ['AGENT_TEST_USER'], defaults={'email': 'agent@example.test'})
u.set_password(os.environ['AGENT_TEST_PASSWORD'])
u.save()
"
cat > "$out/test-user.md" <<EOF
# Compte de test (app locale uniquement)

- Page de connexion : http://localhost:4200/auth/login
- Nom d'utilisateur : $user
- Mot de passe : $password
EOF

nohup "$PYTHON" manage.py runserver 8000 > "$out/api.log" 2>&1 < /dev/null &
(cd frontend && nohup npx ng serve --port 4200 > "../$out/ng-serve.log" 2>&1 < /dev/null &)

if ! timeout "${START_TIMEOUT:-300}" bash -c \
  'until curl -sf http://localhost:8000/api/auth/csrf/ >/dev/null && curl -sf http://localhost:4200/ >/dev/null; do sleep 3; done'; then
  echo "::error::l'app n'a pas démarré à temps"
  tail -n 50 "$out/api.log" "$out/ng-serve.log"
  exit 1
fi
echo "App prête : http://localhost:4200 (API Django : http://localhost:8000/api, compte de test dans $out/test-user.md)"
