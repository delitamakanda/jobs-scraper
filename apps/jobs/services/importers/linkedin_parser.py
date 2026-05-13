from bs4 import BeautifulSoup
from apps.jobs.services.importers.base import ImportedJob
from apps.jobs.services.importers.generic_parser import clean_text

class LinkedInExtractionError(Exception):
    pass

def parse_linkedin_job(html_content: str, url: str, source: str) -> ImportedJob:
    soup = BeautifulSoup(html_content, 'lxml')

    title = ''

    og_title = soup.find('meta', attrs={'property': 'og:title'})
    if og_title:
        title = clean_text(og_title['content'])
    
    description = ''
    meta_description = soup.find('meta', attrs={'name': 'description'})
    if meta_description:
        description = clean_text(meta_description['content'])
    page_text = clean_text(soup.get_text(" "))

    if len(page_text) > len(description):
        description = page_text[:5000]

    if not description or len(description) < 100:
        raise LinkedInExtractionError(
            "LinkedIn ne fournit pas une description complète de l'offre d'emploi.",
            "Utiliser le mode copier-coller pour importer l'offre d'emploi, ou vérifier que l'URL est correcte et que la page est accessible."
        )
    return ImportedJob(
        title=title,
        company='',
        location='',
        description=description,
        url=url,
        source=source
    )