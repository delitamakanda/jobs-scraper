import json
import re
from apps.ai.services.llm_client import LLMClient
from apps.ai.services.parsers import parse_json_response


def analyze_job_offer(job):
    client = LLMClient()

    system_prompt = """
Tu es un agent IA spécialisé dans l'analyse d'offres d'emploi tech.
Tu dois répondre uniquement avec un JSON valide.
Aucun markdown.
Aucun commentaire.
    """

    user_prompt = f"""
    Analyse cette offre d'emploi pour une développeuse Angular senior.

    Offre: {job.raw_description}

returner ce JSON:
{{
"required_skills": [],
"nice_to_have_skills": [],
"extracted_skills": [],
"seniority": "",
"business_domain": "",
"ai_summary": "",
"red_flag": []
}}
"""
    raw_response = client.chat(system_prompt, user_prompt)
    response = parse_json_response(raw_response)

    job.required_skills = response['required_skills']
    job.nice_to_have_skills = response['nice_to_have_skills']
    job.extracted_skills = response['extracted_skills']
    job.seniority = response['seniority']
    job.business_domain = response['business_domain']
    job.ai_summary = response['ai_summary']
    job.red_flag = response['red_flag']
    job.save()
    
    return response



