from bs4 import BeautifulSoup
from apps.jobs.services.importers.base import ImportedJob
from apps.jobs.services.importers.generic_parser import clean_text

def parse_hellowork_job(html: str, url: str, source: str) -> ImportedJob:
    soup = BeautifulSoup(html, 'lxml')

    title = ""
    company = ""
    location = ""
    description = ""

    h1 = soup.find('h1')
    if h1:
        title = clean_text(h1.get_text())
    
    og_title = soup.find('meta', attrs={'property': 'og:title'})
    if not title and og_title:
        title = clean_text(og_title['content'])
    
    meta_description = soup.find('meta', attrs={'property': 'og:description'})
    if meta_description:
        description = clean_text(meta_description['content'])
    
    page_text = clean_text(soup.get_text(" "))

    if len(page_text) > len(description):
        description = page_text[:5000]  # Limit to 5000 characters

    return ImportedJob(
        title=title,
        company=company,
        location=location,
        description=description,
        url=url,
        source=source
    )