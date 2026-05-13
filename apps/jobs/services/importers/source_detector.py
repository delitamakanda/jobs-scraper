from apps.jobs.models import JobOffer

def detect_source(url: str) -> str:
    normalized_url = url.lower()
    if 'linkedin' in normalized_url:
        return JobOffer.Source.LINKEDIN
    elif 'hellowork' in normalized_url:
        return JobOffer.Source.HELLOWORK
    else:
        return JobOffer.Source.OTHER
