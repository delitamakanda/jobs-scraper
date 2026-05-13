from apps.jobs.models import JobMatch

def match_job_with_profile(job_offer, user_profile):
    profile = user_profile.candidate

    profile_skills = set(profile.main_skills + profile.secondary_skills)
    job_skills = set(job_offer.required_skills + job_offer.nice_to_have_skills)

    matched = list(profile_skills.intersection(job_skills))
    missing = list(job_skills.difference(profile_skills))

    score = int((len(matched) / max(len(job_skills), 1)) * 100)

    match, _ = JobMatch.objects.update_or_create(
        job_offer=job_offer,
        defaults={
            'score': score,
            'strengths': matched,
            'missing_skills': missing,
            'weaknesses': missing,
            'recommendations': [
                "Adapter le CV avec les mots clés de l'offre",
                "Préparer un exemple concret de migration Angular",
                "Mettre en avant l'expérience mobile Ionic",
            ],
            "generated_cover_letter": "",
            "generated_pitch": "",
        }
    )

    return {
        "score": match.score,
        "strengths": match.strengths,
        "missing_skills": match.missing_skills,
        "recommendations": match.recommendations,
    }