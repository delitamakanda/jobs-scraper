# **Rapport Final d'Orchestration – Dépôt `ai/prompts/`**
*Date : 29 juin 2026*
*Orchestrateur : Agent Chef d'Orchestre*

---

---

## **📌 Synthèse Exécutive**
Le dépôt `ai/prompts/` est **incomplet, non standardisé et non sécurisé**, avec **3 fichiers de prompts vides sur 4** (`generate_pitch.txt`, `interview_prep.txt`, `match_profile.txt`). Seul `analyze_job.txt` est opérationnel, avec une sortie JSON stricte mais **sans validation, tests, ou documentation**.
**Risques majeurs** :
- Incohérence des formats entre prompts (JSON imposé pour `analyze_job.txt`, rien pour les autres).
- Absence de **README**, **tests**, **CI/CD**, ou **contrôles de sécurité**, rendant le dépôt **non maintenable** et **vulnérable** (fichiers vides exposés, pas de validation des entrées/sorties).
- **Manque de modularité** : pas de sous-dossiers par domaine fonctionnel (ex: `analysis/`, `generation/`).
- **Accessibilité limitée** : JSON brut peu lisible pour les outils d’assistance (lecteurs d’écran).

**Priorité absolue** :
1. **Compléter les prompts vides** (blocage fonctionnel).
2. **Standardiser les formats** (JSON pour tous, schémas de validation).
3. **Ajouter un README + documentation technique** (blocage pour les contributeurs).
4. **Sécuriser les fichiers vides** (risque d’injection si référencés).
5. **Mettre en place des tests et une CI/CD** (garantie de qualité).

---

---

## **🚨 Problèmes Classés par Priorité**
*(Ordre : Critique → Élevé → Moyen → Faible)*

---

### **🔴 Priorité Critique (À résoudre immédiatement)**
| **ID** | **Problème** | **Impact** | **Fichiers/Composants concernés** | **Contradictions détectées** | **Solution Proposée** |
|--------|--------------|------------|-----------------------------------|-------------------------------|------------------------|
| **P1** | **3 fichiers de prompts vides** (`generate_pitch.txt`, `interview_prep.txt`, `match_profile.txt`) | Blocage fonctionnel : dépôts inutilisables pour 75% des cas d’usage. | `ai/prompts/` | Aucun standard défini pour ces fichiers (vs `analyze_job.txt` en JSON strict). | **Remplir les fichiers** avec : <br> - **Rôle clair** (ex: `generate_pitch.txt` → générer un pitch pour un candidat). <br> - **Format de sortie aligné** (JSON, comme `analyze_job.txt`). <br> - **Exemples d’entrée/sortie** (dans un dossier `examples/`). <br> - **Supprimer les fichiers** si non prioritaires (éviter les fichiers vides en production). |
| **P2** | **Absence totale de documentation** (pas de README, pas de métadonnées) | Impossibilité pour les contributeurs de comprendre l’objectif, les formats, ou les dépendances. | Dépôt entier | Tous les agents soulignent ce manque. | **Créer un `README.md`** avec : <br> - Objectif du dépôt (ex: "Prompts pour agents IA spécialisés dans l’analyse du marché tech/emploi"). <br> - **Tableau des prompts** : <br>   | Fichier | Rôle | Format Entrée | Format Sortie | Exemple | <br>   |--------|------|---------------|---------------|---------| <br>   | `analyze_job.txt` | Analyser une offre d’emploi | Texte brut | JSON | [Lien vers exemple] | <br> - **Bonnes pratiques** : <br>   - "Tous les prompts doivent retourner du JSON valide, sans markdown ni commentaires." <br>   - "Les entrées doivent être validées via un schéma JSON." <br> - **Dépendances** (si applicables, ex: Python 3.10+, bibliothèques comme `jsonschema`). |
| **P3** | **Fichiers vides exposés = risque de sécurité** | Vulnérabilité potentielle (injection de contenu malveillant si référencés par des processus critiques). | `generate_pitch.txt`, `interview_prep.txt`, `match_profile.txt` | Agent Sécurité vs Agent Architecture : les premiers veulent les supprimer, les seconds veulent les remplir. | **Solution hybride** : <br> 1. **Supprimer les fichiers vides** si non prioritaires dans les 2 semaines. <br> 2. **Sinon, les remplir immédiatement** avec un contenu par défaut sécurisé (ex: `"Ce prompt est en cours de développement. Ne pas utiliser en production."`). <br> 3. **Restreindre les permissions** (`chmod 600` ou ACLs pour limiter l’écriture). |
| **P4** | **Pas de validation des entrées/sorties** | Risque d’injections JSON ou de sorties malformées (ex: `analyze_job.txt` attend du JSON mais aucune vérification). | `analyze_job.txt` (et futur autres prompts) | Agent Qualité vs Agent Sécurité : tous s’accordent sur le besoin de validation. | **Ajouter des schémas JSON** pour chaque prompt : <br> - Créer un dossier `ai/schemas/` avec : <br>   - `analyze_job_schema.json` (ex: `{ "type": "object", "properties": { "title": { "type": "string" }, "skills": { "type": "array" } }, "required": ["title"] }`). <br> - **Valider les sorties** via un script Python (ex: `validate_prompts.py` utilisant `jsonschema`). <br> - **Intégrer dans la CI/CD** (voir P7). |

---

### **🟠 Priorité Élevée (À résoudre sous 1-2 semaines)**
| **ID** | **Problème** | **Impact** | **Fichiers/Composants concernés** | **Contradictions détectées** | **Solution Proposée** |
|--------|--------------|------------|-----------------------------------|-------------------------------|------------------------|
| **P5** | **Manque de standardisation des prompts** | Incohérence future entre les prompts (ex: certains en JSON, d’autres en markdown). | `ai/prompts/` | Agent Qualité et Agent Architecture demandent une standardisation, mais aucun template n’est proposé. | **Créer un template unique** pour tous les prompts : <br> ```markdown <br> # [Nom du Prompt] <br> **Rôle** : [Description claire en 1 phrase] <br> **Entrée** : [Format attendu, ex: "Texte brut (offre d’emploi)"] <br> **Sortie** : [Format strict, ex: "JSON valide (schéma: `ai/schemas/[nom]_schema.json`)"] <br> **Exemple** : <br> ```input <br> [Exemple d’entrée] <br> ``` <br> ```output <br> { "exemple": "de sortie JSON" } <br> ``` <br> **Contraintes** : <br> - Pas de markdown dans les sorties. <br> - Longueur max: [X] tokens. <br> ``` <br> **Appliquer ce template** à tous les fichiers (y compris `analyze_job.txt` pour uniformité). |
| **P6** | **Pas de tests ni d’exemples** | Impossibilité de valider la qualité des prompts ou de guider les utilisateurs. | Dépôt entier | Tous les agents (Qualité, DevOps, Performance) demandent des tests. | **Ajouter** : <br> 1. **Dossier `examples/`** : <br>    - `examples/analyze_job_input.txt` + `examples/analyze_job_output.json`. <br>    - Remplir pour les autres prompts une fois complétés. <br> 2. **Dossier `tests/`** : <br>    - Scripts Python pour valider : <br>      - La sortie est du JSON valide (via `json.loads()`). <br>      - La sortie respecte le schéma JSON (via `jsonschema`). <br>    - Exemple : <br>      ```python <br>      import json <br>      from jsonschema import validate <br>      def test_analyze_job(): <br>          with open("ai/prompts/analyze_job.txt") as f: <br>              prompt = f.read() <br>          # Simuler une entrée et vérifier la sortie <br>          output = call_llm(prompt, input="...")  # À implémenter <br>          assert json.loads(output)  # Vérifie JSON valide <br>          with open("ai/schemas/analyze_job_schema.json") as schema: <br>              validate(instance=json

Roadmap:
Voici une **feuille de route structurée en tickets** pour résoudre les problèmes du dépôt `ai/prompts/`, avec priorités, efforts, dépendances, risques, métriques de succès et responsabilités.

---

```markdown
# 📋 Feuille de Route – Dépôt `ai/prompts/`
**Date :** 29 juin 2026
**Responsable :** Product Owner Technique (Synthèse)
**Objectif :** Rendre le dépôt **complet, standardisé, sécurisé et maintenable**.

---

---

## 🎯 **Tickets par Priorité**

---

### **🔴 Priorité Critique (À traiter sous 48h)**
#### **📌 [T1] Compléter les prompts vides**
- **Description :** Remplir les 3 fichiers vides (`generate_pitch.txt`, `interview_prep.txt`, `match_profile.txt`) avec :
  - Un **rôle clair** (ex: `generate_pitch.txt` → "Générer un pitch personnalisé pour un candidat").
  - Un **format de sortie JSON** aligné sur `analyze_job.txt`.
  - Un **exemple d’entrée/sortie** (à placer dans `examples/`).
- **Effort :** 3 jours (1 jour par fichier + validation).
- **Dépendances :**
  - Aucune (peut être traité en parallèle de T2).
  - **Bloque** T5 (standardisation) et T7 (tests).
- **Risques/Obstacles :**
  - **Risque de blocage** si les parties prenantes ne valident pas rapidement les rôles des prompts.
  - **Obstacle** : Manque de clairvoyance sur les cas d’usage métiers (ex: format attendu pour `match_profile.txt`).
- **Métriques de succès :**
  - 3 fichiers **non vides**, avec un contenu **fonctionnel et validé**.
  - Exemples d’entrée/sortie **disponibles et testés**.
- **Parties prenantes :**
  - **Responsable :** Équipe Dev (Rédacteurs de prompts).
  - **Validateurs :** Équipe Métier (pour les cas d’usage) + Sécurité (pour les formats).
  - **Contributeurs :** Agent Qualité (validation des exemples).

---

#### **📌 [T2] Créer un README.md complet**
- **Description :**
  - Documenter :
    - **Objectif du dépôt** (ex: "Prompts pour agents IA spécialisés dans l’analyse du marché tech/emploi").
    - **Tableau des prompts** (fichier | rôle | format entrée | format sortie | exemple).
    - **Bonnes pratiques** (ex: "Tous les prompts doivent retourner du JSON valide").
    - **Dépendances** (ex: Python 3.10+, `jsonschema`).
    - **Processus de contribution** (ex: "Les PR doivent inclure un exemple et un test").
- **Effort :** 2 jours.
- **Dépendances :**
  - **Dépend de** T1 (pour lister les prompts complétés).
  - **Bloque** T3 (sécurisation) et T6 (exemples).
- **Risques/Obstacles :**
  - **Risque de retard** si les parties prenantes ne fournissent pas les informations métiers.
  - **Obstacle** : Alignement sur le ton et le niveau de détail (trop technique vs. trop haut niveau).
- **Métriques de succès :**
  - README **validé par l’équipe Dev et Métier**.
  - 100% des contributeurs capables de **comprendre et utiliser le dépôt** sans assistance.
- **Parties prenantes :**
  - **Responsable :** Product Owner.
  - **Validateurs :** Équipe Dev + Métier + Sécurité.
  - **Contributeurs :** Agent Documentation.

---

#### **📌 [T3] Sécuriser les fichiers vides (solution temporaire)**
- **Description :**
  1. **Supprimer** les fichiers vides si non prioritaires (décision à prendre sous 48h).
  2. **Sinon**, les remplir avec un message par défaut :
     ```text
     {"error": "Ce prompt est en cours de développement. Ne pas utiliser en production."}
     ```
  3. **Restreindre les permissions** (`chmod 600` ou ACLs).
- **Effort :** 1 jour.
- **Dépendances :**
  - **Dépend de** T1 (si les fichiers ne sont pas complétés à temps).
- **Risques/Obstacles :**
  - **Risque de sécurité** si les fichiers restent vides et accessibles.
  - **Obstacle** : Désaccord entre Sécurité (suppression) et Architecture (remplissage).
- **Métriques de succès :**
  - Aucun fichier vide **exposé en production**.
  - Permissions **restreintes** (vérifié via `ls -l`).
- **Parties prenantes :**
  - **Responsable :** Équipe Sécurité.
  - **Validateurs :** Product Owner.
  - **Contributeurs :** Agent DevOps.

---

#### **📌 [T4] Ajouter des schémas JSON pour validation**
- **Description :**
  - Créer un dossier `ai/schemas/` avec :
    - `analyze_job_schema.json` (schéma pour `analyze_job.txt`).
    - Schémas pour les autres prompts une fois complétés (T1).
  - **Valider les sorties** via un script Python (`validate_prompts.py` utilisant `jsonschema`).
- **Effort :** 3 jours.
- **Dépendances :**
  - **Dépend de** T1 (pour les schémas des nouveaux prompts).
  - **Bloque** T7 (CI/CD).
- **Risques/Obstacles :**
  - **Risque de schémas incomplets** si les formats ne sont pas clairement définis.
  - **Obstacle** : Manque d’expertise en `jsonschema` dans l’équipe.
- **Métriques de succès :**
  - 100% des prompts **validés par un schéma JSON**.
  - Script de validation **intégré et testé**.
- **Parties prenantes :**
  - **Responsable :** Équipe Dev.
  - **Validateurs :** Équipe Qualité + Sécurité.
  - **Contributeurs :** Agent Architecture.

---

---

### **🟠 Priorité Élevée (À traiter sous 1-2 semaines)**
#### **📌 [T5] Standardiser les prompts avec un template unique**
- **Description :**
  - Créer un **template Markdown** pour tous les prompts (exemple ci-dessous) et l’appliquer à :
    - `analyze_job.txt` (pour uniformité).
    - Les prompts complétés (T1).
  - Template :
    ```markdown
    # [Nom du Prompt]
    **Rôle** : [Description claire en 1 phrase]
    **Entrée** : [Format attendu, ex: "Texte brut (offre d’emploi)"]
    **Sortie** : JSON valide (schéma: `ai/schemas/[nom]_schema.json`)
    **Exemple** :
    ```input
    [Exemple d’entrée]
    ```
    ```output
    { "exemple": "de sortie JSON" }
    ```
    **Contraintes** :
    - Pas de markdown dans les sorties.
    - Longueur max: 2048 tokens.
    ```
- **Effort :** 2 jours.
- **Dépendances :**
  - **Dépend de** T1 (prompts complétés) et T4 (schémas).
- **Risques/Obstacles :**
  - **Risque d’incohérence** si le template n’est pas respecté.
  - **Obstacle** : Résistance au changement de format pour `analyze_job.txt`.
- **Métriques de succès :**
  - 100% des prompts **conformes au template**.
  - **0 erreur** de format détectée lors des tests.
- **Parties prenantes :**
  - **Responsable :** Équipe Dev.
  - **Validateurs :** Agent Qualité.
  - **Contributeurs :** Rédacteurs de prompts.

---

#### **📌 [T6] Ajouter des exemples et des tests unitaires**
- **Description :**
  - **Dossier `examples/` :**
    - `analyze_job_input.txt` + `analyze_job_output.json` (déjà existant ? À vérifier).
    - Exemples pour les autres prompts (une fois complétés via T1).
  - **Dossier `tests/` :**
    - Scripts Python pour :
      - Vérifier que la sortie est du **JSON valide** (`json.loads()`).
      - Vérifier que la sortie **respecte le schéma** (`jsonschema`).
    - Exemple de test :
      ```python
      import json
      from jsonschema import validate

      def test_analyze_job():
          with open("ai/prompts/analyze_job.txt") as f:
              prompt = f.read()
          output = call_llm(prompt, input="...")  # À implémenter
         