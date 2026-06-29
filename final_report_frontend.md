Voici le **rapport final synthétisé et priorisé**, structuré pour une **feuille de route actionnable** par le Product Owner.
Toutes les informations sont **concrètes, spécifiques au dépôt**, et organisées par **priorité business/technique**.
Les contradictions entre agents sont résolues (ex: stockage du token en `localStorage` vs `HttpOnly Cookies` → priorité à la sécurité).

---

---

# **📌 Rapport d'Audit Complet – CareerAgent (Angular 21)**
*Date : 29/06/2026 | Version : 1.0*
*Objectif : Feuille de route priorisée pour le Product Owner*

---

---

## **🚨 Priorités Critiques (À Traiter Immédiatement)**
*Impact : Sécurité, données utilisateurs, conformité légale*

| **ID** | **Problème** | **Risque** | **Solution** | **Effort** | **Owner** | **Échéance** |
|--------|--------------|------------|--------------|------------|-----------|--------------|
| **SEC-001** | **Token JWT stocké en `localStorage`** (vulnérable aux XSS) | **🔴 Critique** : Vol de session possible via injection de script malveillant. | **Remplacer par `HttpOnly Cookies`** côté backend + front. <br> - Backend : Configurer Django/Node pour émettre des cookies `HttpOnly`, `Secure`, `SameSite=Strict`. <br> - Frontend : Supprimer `localStorage.setItem(AUTH_TOKEN_KEY)` et utiliser `withCredentials: true` dans `HttpClient`. <br> - *Alternative temporaire* : Implémenter un **CSP strict** (voir [SEC-004](#)). | **Haut** (2-3j) | Backend + Frontend | **Sous 1 semaine** |
| **SEC-002** | **Absence de sanitization des entrées utilisateur** (ex: `raw_description` dans `JobsCreatePage`) | **🔴 Critique** : Risque d’injection XSS si le serveur renvoie des données non échappées. | **1. Frontend** : Utiliser `DomSanitizer` pour les contenus dynamiques : <br> ```typescript <br> import { DomSanitizer } from '@angular/platform-browser'; <br> safeHtml = this.sanitizer.bypassSecurityTrustHtml(userInput); <br> ``` <br> **2. Backend** : Valider et échapper toutes les entrées (ex: Django `escape()`). | **Moyen** (1-2j) | Frontend + Backend | **Sous 1 semaine** |
| **SEC-003** | **Absence de protection CSRF** | **🔴 Critique** : Attaques CSRF possibles sur les requêtes POST/PUT/DELETE. | **1. Backend** : Activer la protection CSRF (ex: Django `CsrfViewMiddleware`). <br> **2. Frontend** : Ajouter `withCsrfProtection()` dans `provideHttpClient()` (Angular 17+). | **Faible** (1j) | Backend | **Sous 1 semaine** |
| **SEC-004** | **Absence de headers de sécurité HTTP** (CSP, X-Frame-Options, etc.) | **🔴 Critique** : Vulnérabilités XSS, clickjacking, etc. | **Backend** : Configurer les headers via middleware (ex: Helmet pour Express.js) : <br> ```javascript <br> app.use(helmet()); <br> app.use(helmet.contentSecurityPolicy({ <br>   directives: { <br>     defaultSrc: ["'self'"], <br>     scriptSrc: ["'self'", "'unsafe-inline'", "trusted.cdn.com"] <br>   } <br> })); <br> ``` | **Faible** (1j) | Backend | **Sous 1 semaine** |
| **SEC-005** | **Exposition des erreurs serveur** (ex: `store.error()` affiche les stack traces) | **🔴 Critique** : Fuite d’informations sensibles (ex: détails DB, chemins de fichiers). | **1. Frontend** : Remplacer les erreurs brutes par des messages génériques : <br> ```typescript <br> catchError((err) => { <br>   this._error.set('Une erreur est survenue. Veuillez réessayer.'); <br>   return throwError(() => err); <br> }) <br> ``` <br> **2. Backend** : Ne jamais retourner de stack traces en production. | **Faible** (1j) | Frontend + Backend | **Sous 1 semaine** |
| **SEC-006** | **Mots de passe envoyés en clair** (formulaire `SignupPage`) | **🔴 Critique** : Interception possible via MITM si HTTPS non forcé. | **1. Backend** : Forcer HTTPS en production (via Nginx/Apache ou `secure: true` pour les cookies). <br> **2. Backend** : Stocker les mots de passe avec **bcrypt** (hash + salt). | **Moyen** (1-2j) | Backend | **Sous 1 semaine** |
| **SEC-007** | **Tokens JWT non expirants** | **🟡 Élevé** : Risque de réutilisation de tokens volés. | **Backend** : Implémenter des **refresh tokens** avec : <br> - Durée de vie courte pour le token principal (ex: 15 min). <br> - Endpoint `/auth/refresh/` pour rafraîchir le token. <br> **Frontend** : Ajouter une logique de rafraîchissement automatique : <br> ```typescript <br> if (this.jwtHelper.isTokenExpired(token)) { <br>   this.refreshToken().subscribe(); <br> } <br> ``` | **Moyen** (2j) | Backend + Frontend | **Sous 2 semaines** |

---

---

## **🛠 Priorités Élevées (Améliorations Structurelles)**
*Impact : Stabilité, maintenabilité, performance*

| **ID** | **Problème** | **Risque** | **Solution** | **Effort** | **Owner** | **Échéance** |
|--------|--------------|------------|--------------|------------|-----------|--------------|
| **ARCH-001** | **Duplication de code** (ex: `generateCoverletter` dans `ApplicationsApi` et `JobsApi`) | **🟡 Élevé** : Maintenance complexe, risques d’incohérences. | **Créer un service `GenerativeAiService`** pour centraliser : <br> - `generateCoverletter` <br> - `generateInterviewPreparation` <br> - Logique commune de génération IA. | **Moyen** (2j) | Frontend | **Sous 2 semaines** |
| **ARCH-002** | **Stores avec logique métier dupliquée** (ex: `ApplicationStore` appelle directement `api.generateCoverletter`) | **🟡 Élevé** : Violation du principe *Single Responsibility*. | **Externaliser la logique** : <br> - Créer un `AIGenerationService` pour gérer les appels IA. <br> - Les stores (`ApplicationStore`, `JobsStore`) appellent ce service. | **Moyen** (2j) | Frontend | **Sous 2 semaines** |
| **ARCH-003** | **Modèles de données incohérents** (ex: `JobOffer.user` référence `RegisterUser` avec `password`) | **🟡 Élevé** : Fuite de données sensibles, circularité. | **Créer des interfaces dédiées** : <br> ```typescript <br> // Dans shared/models/user.model.ts <br> export interface User { <br>   id: number; <br>   username: string; <br>   email: string; <br> } <br> // Dans JobOffer <br> user: User; // Au lieu de RegisterUser <br> ``` | **Faible** (1j) | Frontend | **Sous 2 semaines** |
| **ARCH-004** | **Méthodes manquantes dans les stores** (ex: `updateApplicationStatus` appelée mais non implémentée) | **🟡 Élevé** : Erreurs runtime, fonctionnalités cassées. | **Implémenter les méthodes manquantes** : <br> - Dans `JobsStore` : Ajouter `updateApplicationStatus`. <br> - Dans `ApplicationStore` : Mettre à jour `_applications` après `generateCoverletter`. | **Faible** (1j) | Frontend | **Sous 1 semaine** |
| **ARCH-005** | **Inconsistance des types RxJS** (ex: `Observable` importé depuis `rxjs/internal/Observable`) | **🟢 Moyen** : Problèmes de compatibilité

Roadmap:
Voici une **feuille de route structurée en tickets**, avec priorités, estimations, dépendances, risques, métriques de succès et parties prenantes. Les tickets sont organisés par **sprints** (1 sprint = 2 semaines) pour une exécution progressive.

---

---

---

## **📅 Feuille de Route – CareerAgent**
**Période couverte** : 29/06/2026 → 13/08/2026 (7 sprints)
**Objectif** : Résoudre les problèmes critiques (sécurité) en **Sprint 0**, puis améliorer l’architecture et la maintenabilité.

---

---

## **🚀 Sprint 0 (29/06/2026 – 12/07/2026) – Urgence Sécurité**
*Focus : Corriger les vulnérabilités **🔴 Critique** et **🟡 Élevé** (impact immédiat sur les utilisateurs).*

---

### **🔹 Tickets Critiques (Priorité 1)**
---

#### **🎫 [SEC-001] – Migration des tokens JWT vers HttpOnly Cookies**
- **Description** :
  Remplacer le stockage des tokens JWT en `localStorage` par des **HttpOnly Cookies** (côté backend et frontend).
  - Backend : Configurer Django/Node pour émettre des cookies `HttpOnly`, `Secure`, `SameSite=Strict`.
  - Frontend : Supprimer `localStorage.setItem(AUTH_TOKEN_KEY)` et utiliser `withCredentials: true` dans `HttpClient`.
  - *Fallback* : Implémenter un **CSP strict** (lié à [SEC-004]) si la migration prend trop de temps.

- **Effort** : **Haut** (2-3 jours)
  - Backend : 1.5j
  - Frontend : 1j
  - Tests : 0.5j

- **Priorité** : **P0 (Critique)**
- **Dépendances** :
  - Aucune (peuvent être traités en parallèle avec [SEC-004] pour le CSP).
  - **Bloque** : [SEC-007] (refresh tokens) car nécessite une refonte du système d’authentification.

- **Risques/Obstacles** :
  - **Risque technique** : Incompatibilité avec les APIs tierces (ex: OAuth) si elles attendent un token en header.
    *Solution* : Maintenir un support temporaire des deux méthodes (cookies + headers) pendant la transition.
  - **Risque business** : Impact sur les utilisateurs existants (déconnexion forcée).
    *Solution* : Communiquer via un banner avant déploiement + session étendue pour les tokens existants.
  - **Obstacle** : Manque de documentation sur la configuration backend (Django/Node).
    *Atténuation* : Impliquer l’équipe DevOps pour valider la configuration.

- **Métriques de succès** :
  - 100% des tokens stockés en `HttpOnly Cookies` (vérifié via DevTools).
  - 0 incident de vol de session signalé après déploiement.
  - Tests de pénétration (OWASP ZAP) : 0 vulnérabilité liée aux XSS via `localStorage`.

- **Parties prenantes** :
  | Rôle | Responsabilité | Implication |
  |------|----------------|-------------|
  | **Backend Lead** | Configurer les cookies côté serveur | **Principal** |
  | **Frontend Lead** | Adapter le frontend pour utiliser `withCredentials` | **Principal** |
  | **DevOps** | Valider la configuration HTTPS et les headers | **Secondaire** |
  | **QA** | Tester les flux d’authentification | **Secondaire** |
  | **Product Owner** | Prioriser et valider les choix techniques | **Consultatif** |

---

#### **🎫 [SEC-002] – Sanitization des entrées utilisateur (XSS)**
- **Description** :
  Ajouter une sanitization systématique des entrées utilisateur pour éviter les injections XSS.
  - **Frontend** : Utiliser `DomSanitizer` pour les contenus dynamiques (ex: `raw_description`).
  - **Backend** : Valider et échapper les entrées (ex: Django `escape()`).

- **Effort** : **Moyen** (1-2 jours)
  - Frontend : 1j
  - Backend : 1j

- **Priorité** : **P0 (Critique)**
- **Dépendances** :
  - Aucune (indépendant des autres tickets).
  - **Recommandation** : Traiter en parallèle avec [SEC-005] (masquage des erreurs) pour une couverture sécurité complète.

- **Risques/Obstacles** :
  - **Risque technique** : Faux positifs dans la sanitization (ex: balises HTML légitimes supprimées).
    *Solution* : Utiliser une liste blanche de balises autorisées (ex: `<b>`, `<i>`, `<a>`).
  - **Obstacle** : Manque de tests unitaires pour valider la sanitization.
    *Atténuation* : Ajouter des tests avec des payloads XSS connus (ex: `<script>alert(1)</script>`).

- **Métriques de succès** :
  - 100% des champs utilisateur (ex: `description`, `bio`) sont sanitizés.
  - 0 alerte XSS détectée lors d’un audit manuel ou automatique (ex: Burp Suite).
  - Feedback utilisateur : 0 rapport de contenu corrompu après déploiement.

- **Parties prenantes** :
  | Rôle | Responsabilité |
  |------|----------------|
  | **Frontend Dev** | Implémenter `DomSanitizer` |
  | **Backend Dev** | Valider les entrées côté serveur |
  | **QA** | Tester avec des payloads malveillants |

---

#### **🎫 [SEC-003] – Protection CSRF**
- **Description** :
  Activer la protection CSRF pour les requêtes POST/PUT/DELETE.
  - **Backend** : Configurer `CsrfViewMiddleware` (Django) ou `csurf` (Express.js).
  - **Frontend** : Ajouter `withCsrfProtection()` dans `provideHttpClient()` (Angular 17+).

- **Effort** : **Faible** (1 jour)
  - Backend : 0.5j
  - Frontend : 0.5j

- **Priorité** : **P0 (Critique)**
- **Dépendances** :
  - **Bloqué par** : [SEC-001] (car la protection CSRF peut interférer avec les cookies `HttpOnly`).
    *Solution* : Valider que les tokens CSRF sont compatibles avec les cookies `HttpOnly`.

- **Risques/Obstacles** :
  - **Risque technique** : Conflits avec les APIs externes (ex: paiement) qui n’envoient pas de token CSRF.
    *Solution* : Exclure les routes spécifiques via `csrf_exempt` (Django).
  - **Obstacle** : Tests manuels nécessaires pour valider tous les formulaires.
    *Atténuation* : Automatiser les tests avec Cypress pour couvrir les principaux flux.

- **Métriques de succès** :
  - 100% des requêtes mutantes (POST/PUT/DELETE) incluent un token CSRF valide.
  - 0 erreur 403 (Forbidden) liée à l’absence de token CSRF en production.

- **Parties prenantes** :
  | Rôle | Responsabilité |
  |------|----------------|
  | **Backend Dev** | Configurer la protection CSRF |
  | **Frontend Dev** | Adapter Angular pour envoyer le token |
  | **QA** | Valider les formulaires |

---
---
#### **🎫 [SEC-004] – Headers de sécurité HTTP (CSP, X-Frame-Options, etc.)**
- **Description** :
  Configurer les headers de sécurité via un middleware (ex: Helmet pour Express.js).
  Exemple :
  ```javascript
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "trusted.cdn.com"]
    }
  }));
  ```

- **Effort** : **Faible** (1 jour)
- **Priorité** : **P0 (Critique)**
- **Dépendances** :
  - **Recommandation** : Traiter en parallèle avec [SEC-001] pour une protection optimale.

- **Risques/Obstacles** :
  - **Risque technique** : CSP trop restrictif peut casser des fonctionnalités (ex: chargement de scripts externes).
    *Solution* : Commencer avec une politique permissive (`defaultSrc: ['self', 'unsafe-inline']`) puis durcir progressivement