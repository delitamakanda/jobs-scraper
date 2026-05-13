# AGENTS.md

Instructions pour les agents IA qui travaillent sur ce dépôt.

## Portée

Ces consignes s'appliquent à tout le dépôt `jobs-scraper`.

## Vue rapide du projet

- API de gestion carrère tech avec IA.
- Backend : Python 3.14 + Django 6.0 + Django REST Framework, projet `config/`, apps métier dans `apps/`.
- Frontend : Angular 21 dans `frontend/`.
- Authentification : endpoints DRF internes compatibles token DRF côté API, token stocké dans `localStorage` côté frontend.
- Dev local : base SQLite par défaut ; production : configuration PostgreSQL Azure dans `config/settings_prod.py`.

## Commandes utiles

### Backend

```bash
python3.14 -m venv career-aapi_venv
source career-aapi_venv/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```

Contrôles recommandés avant de livrer une modification backend :

```bash
python3 manage.py check
python3 manage.py test
```

### Frontend

```bash
cd frontend
npm install
npm run start
npm run build
```

Contrôle recommandé avant de livrer une modification frontend :

```bash
cd frontend && npm run build
```

## Conventions de modification

- Préserver la séparation backend/frontend :
  - API, modèles, serializers, permissions et routes DRF dans `apps/*` et `config/`.
  - UI, routes Angular, signals, helpers et assets dans `frontend/src/`.
- Ajouter une migration Django pour tout changement de modèle.
- Ne pas modifier les migrations existantes déjà versionnées, sauf demande explicite.
- Protéger les données utilisateur : filtrer les querysets par `request.user` pour les ressources privées.
- Garder les endpoints API sous le préfixe `/api/`.
- Ne pas committer de secrets, tokens, dumps de base de données, fichiers `.env`, `db.sqlite3`, `media/`, `staticfiles/`, `node_modules/` ou builds temporaires.

## Style

### Python/Django

- Suivre le style Django existant du dépôt.
- Garder les imports simples ; ne pas entourer les imports avec des blocs `try/except`.
- Utiliser des serializers DRF pour valider les entrées API.
- Utiliser `get_object_or_404(..., created_by=request.user)` ou une restriction équivalente pour les objets détenus par un utilisateur.

### JavaScript/Vue

- Suivre le style Angular existant.
- Utiliser l'alias `@/` pour les imports frontend lorsque c'est cohérent avec le code existant.

## Pull requests

Dans le résumé de PR, indiquer :

- ce qui a changé ;
- les fichiers ou zones principales ;
- les tests/contrôles exécutés ;
- les limites connues, notamment si un contrôle n'a pas pu être exécuté pour une raison d'environnement.