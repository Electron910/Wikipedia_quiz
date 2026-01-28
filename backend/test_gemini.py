import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.llm_service import LLMService
from app.services.scraper import WikipediaScraper

def test_quiz_generation():
    scraper = WikipediaScraper()
    llm = LLMService()
    
    # Test URL
    url = "https://en.wikipedia.org/wiki/Albert_Einstein"
    
    print("Scraping Wikipedia...")
    data = scraper.scrape(url)
    print(f"Title: {data['title']}")
    print(f"Content length: {len(data['content'])} chars")
    
    # Test each difficulty
    for difficulty in ["easy", "medium", "hard", "mixed"]:
        print(f"\n{'='*60}")
        print(f"Testing {difficulty.upper()} difficulty")
        print(f"{'='*60}")
        
        questions = llm.generate_quiz(
            title=data["title"],
            content=data["content"],
            sections=data["sections"],
            difficulty=difficulty,
            num_questions=4
        )
        
        print(f"\nGenerated {len(questions)} questions:")
        for i, q in enumerate(questions, 1):
            print(f"\n{i}. {q['question']}")
            print(f"   Options: {q['options']}")
            print(f"   Answer: {q['answer']}")
            print(f"   Difficulty: {q['difficulty']}")

if __name__ == "__main__":
    test_quiz_generation()