import requests


class FetchError(Exception):
    pass

def fetch_html(url: str) -> str:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
    }

    response = requests.get(url, headers=headers, timeout=10)

    if response.status_code >= 400:
        raise FetchError(f"Failed to fetch HTML content. Status code: {response.status_code}")
    return response.text