Voici une **synthèse priorisée** des actions à mener, structurée par **niveau de criticité**, avec des **solutions concrètes** et la **détection des contradictions** entre les rapports. Les informations dupliquées ont été fusionnées.

---

---

---

## **🚨 NIVEAU CRITIQUE (Priorité Absolue)**
*Problèmes bloquants ou à haut risque (sécurité, stabilité, données)*

| **Problème** | **Impact** | **Solutions** | **Agents Concernés** | **Contradictions/Notes** |
|--------------|-----------|---------------|----------------------|--------------------------|
| **Stockage du token JWT en `localStorage`** | Vulnérabilité XSS (vol de session). | ✅ **Remplacer par des cookies HTTP-only** (côté backend) + mécanisme de `refresh_token`.<br>✅ Implémenter un intercepteur pour gérer l'expiration/rafraîchissement. | Architecture, Qualité, Mentor, Sécurité (implicite) | Tous les agents s'accordent sur ce risque. |
| **Aucune sanitization des données dynamiques** (ex: `ai_summary`, `raw_description`) | Risque XSS si le backend retourne du HTML malveillant. | ✅ Utiliser `DomSanitizer` ou un pipe `safeHtml` **avec validation stricte** (ex: autoriser seulement un sous-ensemble de balises).<br>✅ Valider les réponses backend (ex: vérifier que `content` est une string non vide). | Mentor, Qualité | |
| **Fuites mémoire** (subscriptions RxJS non désabonnées) | Ralentissement progressif, crashes possibles. | ✅ **Remplacer par `AsyncPipe`** dans les templates.<br>✅ Pour les subscriptions manuelles : utiliser `takeUntilDestroyed()` (Angular 16+) ou `DestroyRef`.<br>✅ Auditer tous les `subscribe()` dans les composants/stores. | Qualité, Performance, Mentor | Performance recommande `OnPush`, mais c'est orthogonal. |
| **Gestion des erreurs HTTP non centralisée** | Messages génériques (`"Failed to load jobs"`), pas de feedback utilisateur clair. | ✅ **Créer un intercepteur global** pour:<br>- Capturer les erreurs 401/403/500.<br>- Afficher des notifications via `MatSnackBar` (service `NotificationService`).<br>- Rediriger vers `/login` si 401.<br>✅ Standardiser les messages d'erreur (ex: `"Impossible de charger les offres. Veuillez réessayer."`). | Architecture, Qualité, Mentor | Tous s'accordent sur la centralisation. |

---

---

## **⚠️ NIVEAU HAUT (Priorité Élevée)**
*Problèmes impactant l'expérience utilisateur ou la maintenabilité*

| **Problème** | **Impact** | **Solutions** | **Agents Concernés** | **Contradictions/Notes** |
|--------------|-----------|---------------|----------------------|--------------------------|
| **Absence de tests unitaires** (stores, services, composants critiques) | Risque de régressions, difficulté à maintenir. | ✅ **Écrire des tests pour** :<br>- Tous les stores (`AuthStore`, `JobsStore`, etc.) avec `TestBed` + `HttpClientTestingModule`.<br>- Composants clés (`LoginPage`, `SignupPage`, `ApplicationKanbanComponent`).<br>- Gardes de route (`authGuard`).<br>✅ Utiliser **Vitest** (déjà configuré) pour une exécution rapide. | Qualité, Mentor, Architecture | |
| **Code dupliqué** dans les stores (logique de `_loading`, `_error`) | Maintenance difficile, incohérences. | ✅ **Créer une classe de base `BaseStore`** avec:<br>- `loading = signal(false)`<br>- `error = signal<string \| null>(null)`<br>- Méthodes communes (`setLoading`, `setError`, `reset`).<br>✅ **Fusionner les stores liés** (ex: `JobsStore` + `ApplicationsStore` si redondants). | Architecture, Qualité, Mentor | Architecture suggère `@ngrx/signalstore`; Mentor propose une classe de base. **→ Privilégier la classe de base** (plus simple, évite une nouvelle dépendance). |
| **Requêtes API non optimisées** (pas de cache, pas de debounce) | Latence, consommation réseau inutile. | ✅ **Cache HTTP** :<br>- Utiliser `withCache()` (Angular 21+) ou un `ReplaySubject` dans `ApiService`.<br>- Exemple : `this.cache.set(key, this.http.get(...).pipe(shareReplay(1)))`.<br>✅ **Debounce** : Ajouter `debounceTime(300)` pour les recherches utilisateur (ex: barre de recherche jobs).<br>✅ **Éviter les appels redondants** : Vérifier que `loadJobs()` n'est pas appelé à chaque `ngOnInit` (utiliser un flag `loaded`). | Performance, Qualité, Mentor | |
| **Formulaires non standardisés** (mix template-driven + reactive) | Incohérences, validation faible. | ✅ **Standardiser sur les formulaires réactifs** (`ReactiveFormsModule`).<br>✅ **Créer des validateurs personnalisés** réutilisables (ex: `linkedInUrlValidator`).<br>✅ **Typage strict** : Utiliser `FormGroup<ProfileForm>` avec des interfaces dédiées.<br>✅ **`FormArray`** pour les listes (ex: `main_skills`). | Architecture, Qualité, Mentor | |
| **Accessibilité (a11y) non respectée** | Non-conformité WCAG, exclusion d'utilisateurs. | ✅ **Ajouter des attributs ARIA** :<br>- `aria-label` pour les icônes.<br>- `aria-describedby` pour les champs de formulaire.<br>✅ **Vérifier le contraste** avec [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).<br>✅ **Styles `:focus-visible`** pour les éléments interactifs. | Qualité, Mentor | |
| **Texte en dur** (pas d'i18n) | Difficile à traduire, maintenance lourde. | ✅ **Extraire tout le texte** dans des fichiers JSON (ex: `assets/i18n/fr.json`).<br>✅ Utiliser **`@angular/localize`** ou **`ngx-translate`**.<br>✅ Prévoir des traductions pour FR/EN/ES. | Qualité, Mentor, Documentation | |

---

---

## **🔧 NIVEAU MOYEN (Priorité Normale)**
*Améliorations pour la performance, la maintenabilité ou l'UX*

| **Problème** | **Impact** | **Solutions** | **Agents Concernés** | **Contradictions/Notes** |
|--------------|-----------|---------------|----------------------|--------------------------|
| **Bundle size trop élevé** (~500Ko+ pour Material) | Temps de chargement lent (surtout mobile). | ✅ **Optimiser les imports Material** :<br>- Ne pas importer tous les modules dans `MATERIAL_IMPORTS`.<br>- Importer uniquement ceux nécessaires par composant.<br>✅ **Configurer Tailwind pour purger le CSS inutilisé** (en production).<br>✅ **Activer la compression Gzip/Brotli** sur le serveur. | Performance, Architecture | Performance recommande de désactiver les modules inutilisés (ex: `MatStepperModule`). |
| **Pas de lazy loading pour certains composants** (ex: `SidebarComponent`) | Taille initiale du bundle augmentée. | ✅ **Charger `SidebarComponent` et `ShellComponent` paresseusement** via `loadComponent`. | Performance, Mentor | Mentor suggère de lazy-loader `/dashboard`; Performance étend à tous les composants lourds. |
| **Pas de Service Worker (PWA)** | Pas de mise en cache des assets pour les visites répétées. | ✅ **Ajouter `@angular/pwa`** :<br>`ng add @angular/pwa`<br>✅ Configurer le cache des assets statiques (JS, CSS, images). | Performance | |
| **Images non optimisées** | Bandwidth gaspillé. | ✅ **Utiliser `loading="lazy"`** pour les images.<br>✅ **Compresser les images** (ex: avec `ng-optimized-image` ou un CDN).<br>✅ **Formats modernes** (WebP/AVIF). | Performance | |
| **Gestion d'état globale non synchronisée entre onglets** | Incohérences si plusieurs onglets ouverts. | ✅ **Utiliser `BroadcastChannel`** pour

Roadmap:
Voici une **feuille de route structurée** avec tickets priorisés, dépendances, risques, métriques et responsabilités, basée sur votre rapport d'analyse.

---

---

## **📌 Feuille de Route Produit**
**Objectif** : Résoudre les problèmes critiques, améliorer la maintenabilité et l'UX, tout en optimisant les performances.
**Période** : 6 à 8 semaines (sprints de 2 semaines).
**Équipe** : 1 PO (vous), 2 devs frontend (Angular), 1 dev backend (si besoin), 1 QA, 1 expert sécurité.

---

---

---

## **🚨 Sprint 1-2 : Résolution des Critiques (Priorité Absolue)**
### **🎯 Objectif** : Éliminer les risques de sécurité et de stabilité.

---

#### **🔴 Ticket 1.1 : Sécuriser le stockage des tokens JWT**
- **Description** : Remplacer `localStorage` par des cookies HTTP-only + mécanisme de `refresh_token`.
- **Tâches** :
  - [ ] Modifier le backend pour émettre des cookies HTTP-only (`Set-Cookie` header).
  - [ ] Implémenter un intercepteur Angular pour gérer l'expiration/rafraîchissement des tokens.
  - [ ] Mettre à jour le frontend pour lire les cookies (via `HttpClient` avec `withCredentials: true`).
  - [ ] Tests : Vérifier que le token n'est pas accessible via JS (`document.cookie` ne doit pas l'afficher).
- **Priorité** : **P0** (Critique).
- **Effort** : **5 jours** (2 backend + 3 frontend).
- **Dépendances** :
  - Backend doit être disponible pour les tests d'intégration.
- **Risques/Obstacles** :
  - Résistance du backend à modifier la gestion des tokens (à aligner avec l'équipe backend).
  - Problèmes de CORS si les cookies ne sont pas correctement configurés.
- **Métriques de succès** :
  - 100% des tokens stockés en HTTP-only.
  - Aucun token accessible via `localStorage` ou `sessionStorage`.
  - Tests de pénétration (XSS) passants.
- **Parties prenantes** :
  - **Responsable** : Dev Backend + Dev Frontend.
  - **Validation** : Équipe Sécurité (revue de code).
  - **Support** : PO (coordination).

---

#### **🔴 Ticket 1.2 : Sanitization des données dynamiques**
- **Description** : Protéger contre les attaques XSS en validant/sanitizing les données dynamiques (ex: `ai_summary`).
- **Tâches** :
  - [ ] Ajouter `DomSanitizer` dans les composants affichant du HTML dynamique.
  - [ ] Créer un pipe `safeHtml` avec une whitelist de balises autorisées (ex: `<b>`, `<i>`, `<a>`).
  - [ ] Valider les réponses backend (ex: vérifier que `content` est une string non vide).
  - [ ] Tests : Injecter du HTML malveillant et vérifier qu'il est neutralisé.
- **Priorité** : **P0**.
- **Effort** : **3 jours**.
- **Dépendances** :
  - Aucune (peut être fait en parallèle du Ticket 1.1).
- **Risques/Obstacles** :
  - Faux positifs si la whitelist est trop restrictive (ex: bloquer du HTML légitime).
  - Performance impactée si la sanitization est trop lourde.
- **Métriques de succès** :
  - 0 incident XSS détecté en tests de pénétration.
  - Toutes les données dynamiques passent par `DomSanitizer` ou `safeHtml`.
- **Parties prenantes** :
  - **Responsable** : Dev Frontend (Mentor).
  - **Validation** : Équipe Qualité (tests automatisés).

---
#### **🔴 Ticket 1.3 : Correction des fuites mémoire (RxJS)**
- **Description** : Éliminer les fuites mémoire liées aux subscriptions non désabonnées.
- **Tâches** :
  - [ ] Remplacer les `subscribe()` manuels par `AsyncPipe` dans les templates.
  - [ ] Pour les subscriptions nécessaires : utiliser `takeUntilDestroyed()` (Angular 16+).
  - [ ] Auditer tous les fichiers `.ts` pour repérer les `subscribe()` non gérés.
  - [ ] Tests : Vérifier l'absence de fuites avec Chrome DevTools (onglet Memory).
- **Priorité** : **P0**.
- **Effort** : **4 jours**.
- **Dépendances** :
  - Aucune.
- **Risques/Obstacles** :
  - Régressions si des subscriptions sont désabonnées trop tôt.
  - Adoption de `takeUntilDestroyed()` nécessite Angular 16+ (vérifier la version du projet).
- **Métriques de succès** :
  - 0 fuite mémoire détectée en tests de charge (1000 utilisateurs simultanés).
  - Couverture à 100% des `subscribe()` avec `AsyncPipe` ou `takeUntilDestroyed()`.
- **Parties prenantes** :
  - **Responsable** : Dev Frontend (Performance).
  - **Validation** : Équipe Qualité (tests manuels + automatisés).

---
#### **🔴 Ticket 1.4 : Centralisation de la gestion des erreurs HTTP**
- **Description** : Créer un intercepteur global pour gérer les erreurs HTTP (401, 403, 500, etc.).
- **Tâches** :
  - [ ] Créer un `ErrorInterceptor` pour capturer les erreurs HTTP.
  - [ ] Intégrer `MatSnackBar` pour afficher des notifications utilisateur.
  - [ ] Rediriger vers `/login` si erreur 401.
  - [ ] Standardiser les messages d'erreur (ex: `"Impossible de charger les offres. Veuillez réessayer."`).
  - [ ] Tests : Simuler des erreurs HTTP et vérifier le comportement.
- **Priorité** : **P0**.
- **Effort** : **3 jours**.
- **Dépendances** :
  - Ticket 1.1 (si l'intercepteur gère aussi les tokens expirés).
- **Risques/Obstacles** :
  - Messages d'erreur trop génériques ou peu utiles pour le débogage.
  - Conflits avec d'autres interceptors existants.
- **Métriques de succès** :
  - 100% des erreurs HTTP gérées centralement.
  - 0 message d'erreur générique (ex: "Failed to load jobs") en production.
- **Parties prenantes** :
  - **Responsable** : Dev Frontend (Architecture).
  - **Validation** : Équipe Qualité + UX (clarté des messages).

---
---
---
## **⚠️ Sprint 3-4 : Améliorations Hautes Priorités (P1)**
### **🎯 Objectif** : Améliorer la maintenabilité, l'UX et réduire les risques de régression.

---
#### **🟠 Ticket 2.1 : Ajout de tests unitaires**
- **Description** : Écrire des tests pour les stores, services et composants critiques.
- **Tâches** :
  - [ ] Configurer `Vitest` (déjà présent) pour les tests Angular.
  - [ ] Écrire des tests pour :
    - Stores (`AuthStore`, `JobsStore`, etc.) avec `TestBed` + `HttpClientTestingModule`.
    - Composants clés (`LoginPage`, `SignupPage`, `ApplicationKanbanComponent`).
    - Gardes de route (`authGuard`).
  - [ ] Intégrer les tests dans le pipeline CI/CD.
- **Priorité** : **P1**.
- **Effort** : **8 jours** (4 jours par dev).
- **Dépendances** :
  - Ticket 1.3 (pour tester les stores sans fuites mémoire).
- **Risques/Obstacles** :
  - Courbe d'apprentissage pour `Vitest` si l'équipe n'est pas familière.
  - Temps limité pour couvrir tous les cas critiques.
- **Métriques de succès** :
  - Couverture de code > 80% pour les stores et composants critiques.
  - 0 régression détectée après déploiement.
- **Parties prenantes** :
  - **Responsable** : Dev Frontend (Qualité).
  - **Validation** : Équipe Qualité (revue des tests).

---
#### **🟠 Ticket 2.2 : Réduire le code dupliqué dans les stores**
- **Description** : Créer une classe de base `BaseStore` pour standardiser la logique commune (`_loading`, `_error`).
- **Tâches** :
  - [ ] Créer `BaseStore` avec :
    - `loading = signal(false)`.
    - `error = signal<string | null>(null)`.
    - Méthodes communes (`setLoading