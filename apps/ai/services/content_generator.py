from apps.ai.services.llm_client import LLMClient
from apps.ai.services.parsers import parse_json_response

def generate_cover_letter_for_job(*,job, profile, tone='formal', language='fr', format='email', max_length='medium'):
    client = LLMClient()

    system_prompt = """
Tu es un coach de carrière spécialisé tech senior frontend Angular.

Tu écris des messages :
- naturels
- crédibles
- humains
- précis
- jamais génériques
- jamais trop enthousiastes
- jamais corporate bullshit

Le message doit être professionnel mais moderne.
"""

    user_prompt = f"""
Profile du candidat :

Title:
{profile.title}

Résumé:
{profile.summary}

Compétences:
{profile.main_skills}

Experience:
{profile.years_of_experience} ans

Offre:

Titre:
{job.title}

Entreprise:
{job.company}

Résumé IA
{job.ai_summary}

Compétences requises:
{job.required_skills}

Contraintes:

Format: {format}
Ton: {tone}
Langue: {language}
Longueur: {max_length}

Le message doit:
- mettre en avant les migrations Angular
- l'expérience Ionic/mobile
- la collaboration produit
- l'intégration Figma
- les application métiers complexes

Ne fais pas de texte générique, adapte le message à ce profil et cette offre.
"""
    return client.chat(system_prompt=system_prompt, user_prompt=user_prompt)

def generate_interview_prep_for_job(*, job, profile, focus, difficulty, language='fr'):
    client = LLMClient()

    system_prompt = """
Tu es un recruteur technique senior Angular.

Tu prépares une candidate à un entretien frontend senior.

Tu dois répondre uniquement en JSON valide.
Assure-toi que le JSON est complet et bien fermé.
Limite chaque élément à 2-3 phrases maximum pour éviter les troncatures.
"""

    user_prompt = f"""
Profile du candidat :

Titre:
{profile.title}

Compétences:
{profile.main_skills}

Résumé:
{profile.summary}

Offre:

Titre:
{job.title}

Résumé:
{job.ai_summary}

Compétences:
{job.required_skills}

Focus:
{focus}

Difficulté:
{difficulty}

Langue:
{language}

Retourne : 

{{
"questions": ["question 1", "question 2", "question 3"],
"weak_points": ["point faible 1 (max 2 phrases)", "point faible 2 (max 2 phrases)"],
"recommended_topics": ["topic 1", "topic 2", "topic 3"],
"mock_answers": ["réponse 1 (max 3 phrases)", "réponse 2 (max 3 phrases)"]
}}

IMPORTANT: 
- Limite chaque weak_point à 2 phrases maximum
- Limite chaque mock_answer à 3 phrases maximum
- Assure-toi que le JSON est complet et fermé correctement
"""
    raw_response = client.chat(system_prompt=system_prompt, user_prompt=user_prompt)
    return parse_json_response(raw_response)