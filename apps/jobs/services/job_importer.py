from apps.ai.services.job_analyzer import analyze_job_offer
from apps.jobs.models import JobOffer
from apps.applications.models import Application
from apps.jobs.services.importers.source_detector import detect_source
from apps.jobs.services.importers.html_fetcher import fetch_html
from apps.jobs.services.importers.generic_parser import parse_generic_job
from apps.jobs.services.importers.linkedin_parser import parse_linkedin_job
from apps.jobs.services.importers.hellowork_parser import parse_hellowork_job

def import_job_from_url(url: str, user) -> JobOffer:
    source = detect_source(url)
    html = fetch_html(url)

    if source == JobOffer.Source.LINKEDIN:
        imported = parse_linkedin_job(html, url, source)
    elif source == JobOffer.Source.HELLOWORK:
        imported = parse_hellowork_job(html, url, source)
    else:
        imported = parse_generic_job(html, url, source)
    
    job = JobOffer.objects.create(
        user=user,
        source=imported.source,
        title=imported.title,
        company=imported.company,
        location=imported.location,
        url=imported.url,
        raw_description=imported.description,
    )
    Application.objects.create(
        job_offer=job
    )
    analyze_job_offer(job)

    return job