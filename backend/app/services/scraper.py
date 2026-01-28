import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Optional
import re


class WikipediaScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }

    def validate_wikipedia_url(self, url: str) -> bool:
        pattern = r"^https?://(en\.)?wikipedia\.org/wiki/.+"
        return bool(re.match(pattern, url))

    def fetch_page(self, url: str) -> Optional[str]:
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.text
        except requests.RequestException:
            return None

    def extract_title(self, soup: BeautifulSoup) -> str:
        title_element = soup.find("h1", {"id": "firstHeading"})
        return title_element.get_text().strip() if title_element else ""

    def extract_summary(self, soup: BeautifulSoup) -> str:
        content_div = soup.find("div", {"id": "mw-content-text"})
        if not content_div:
            return ""
        
        paragraphs = content_div.find_all("p", recursive=True)
        summary_parts = []
        
        for p in paragraphs[:5]:
            text = p.get_text().strip()
            if len(text) > 50:
                summary_parts.append(text)
                if len(" ".join(summary_parts)) > 500:
                    break
        
        return " ".join(summary_parts)[:1000]

    def extract_sections(self, soup: BeautifulSoup) -> List[str]:
        sections = []
        headings = soup.find_all(["h2", "h3"])
        
        skip_sections = ["See also", "References", "External links", "Notes", 
                        "Further reading", "Bibliography", "Contents"]
        
        for heading in headings:
            headline = heading.find("span", {"class": "mw-headline"})
            if headline:
                section_name = headline.get_text().strip()
                if section_name not in skip_sections:
                    sections.append(section_name)
        
        return sections[:15]

    def extract_full_content(self, soup: BeautifulSoup) -> str:
        content_div = soup.find("div", {"id": "mw-content-text"})
        if not content_div:
            return ""
        
        for element in content_div.find_all(["script", "style", "table", "sup"]):
            element.decompose()
        
        paragraphs = content_div.find_all("p")
        content = " ".join([p.get_text().strip() for p in paragraphs])
        content = re.sub(r"\$\$\d+\$\$", "", content)
        
        content = re.sub(r"\s+", " ", content)
        
        return content[:8000]

    def extract_links(self, soup: BeautifulSoup) -> List[str]:
        content_div = soup.find("div", {"id": "mw-content-text"})
        if not content_div:
            return []
        
        links = []
        for a in content_div.find_all("a", href=True):
            href = a.get("href", "")
            if href.startswith("/wiki/") and ":" not in href:
                title = a.get_text().strip()
                if title and len(title) > 2:
                    links.append(title)
        
        return list(set(links))[:50]

    def scrape(self, url: str) -> Dict:
        if not self.validate_wikipedia_url(url):
            raise ValueError("Invalid Wikipedia URL")
        
        html = self.fetch_page(url)
        if not html:
            raise ConnectionError("Failed to fetch the Wikipedia page")
        
        soup = BeautifulSoup(html, "html.parser")
        
        return {
            "title": self.extract_title(soup),
            "summary": self.extract_summary(soup),
            "sections": self.extract_sections(soup),
            "content": self.extract_full_content(soup),
            "links": self.extract_links(soup),
            "raw_html": html
        }

    def get_title_preview(self, url: str) -> Optional[str]:
        if not self.validate_wikipedia_url(url):
            return None
        
        html = self.fetch_page(url)
        if not html:
            return None
        
        soup = BeautifulSoup(html, "html.parser")
        return self.extract_title(soup)