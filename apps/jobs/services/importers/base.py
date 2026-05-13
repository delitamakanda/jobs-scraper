from dataclasses import dataclass

@dataclass
class ImportedJob:
    title: str
    company: str
    location: str
    description: str
    url: str
    source: str