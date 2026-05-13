from bs4 import BeautifulSoup
from apps.jobs.services.importers.base import ImportedJob

def clean_text(value: str) -> str:
    return ' '.join(value.split()) if value else ''

def parse_generic_job(html: str, url: str, source: str) -> ImportedJob:
    soup = BeautifulSoup(html, 'lxml')

    title = ""

    if soup.find('h1'):
        title = clean_text(soup.find('h1').get_text())

    meta_title = soup.find('meta', property='og:title')
    if not title and meta_title:
        title = clean_text(meta_title['content'])
    
    meta_description = soup.find('meta', property='og:description')
    description = ''
    if meta_description:
        description = clean_text(meta_description['content'])

    main_text = clean_text(soup.get_text())
    if len(main_text) > len(description):
        description = main_text[:5000]  # Limit to 5000 characters

    return ImportedJob(
        title=title,
        company='',
        location='',
        description=description,
        url=url,
        source=source
    )