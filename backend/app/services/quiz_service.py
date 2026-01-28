from sqlalchemy.orm import Session
from typing import Optional, List
import asyncio
from app.models import Quiz
from app.services.scraper import WikipediaScraper
from app.services.llm_service import LLMService


class QuizService:
    def __init__(self):
        self.scraper = WikipediaScraper()
        self.llm_service = LLMService()

    def get_cached_quiz(self, db: Session, url: str, difficulty: str) -> Optional[Quiz]:
        return db.query(Quiz).filter(
            Quiz.url == url,
            Quiz.difficulty == difficulty
        ).first()

    async def generate_quiz_async(self, db: Session, url: str, difficulty: str = "mixed", num_questions: int = 6) -> Quiz:
        existing = self.get_cached_quiz(db, url, difficulty)
        if existing:
            return existing
        
        scraped_data = self.scraper.scrape(url)
        
        llm_results = await self.llm_service.generate_all_async(
            title=scraped_data["title"],
            content=scraped_data["content"],
            sections=scraped_data["sections"],
            links=scraped_data["links"],
            difficulty=difficulty,
            num_questions=num_questions
        )
        
        quiz = Quiz(
            url=url,
            title=scraped_data["title"],
            summary=scraped_data["summary"],
            key_entities=llm_results["entities"],
            sections=scraped_data["sections"],
            quiz_data=llm_results["quiz"],
            related_topics=llm_results["topics"],
            difficulty=difficulty,
            raw_html=scraped_data["raw_html"][:50000] if scraped_data.get("raw_html") else None
        )
        
        db.add(quiz)
        db.commit()
        db.refresh(quiz)
        
        return quiz

    def generate_quiz(self, db: Session, url: str, difficulty: str = "mixed", num_questions: int = 6) -> Quiz:
        return asyncio.run(self.generate_quiz_async(db, url, difficulty, num_questions))

    def get_all_quizzes(self, db: Session, skip: int = 0, limit: int = 100) -> List[Quiz]:
        return db.query(Quiz).order_by(Quiz.created_at.desc()).offset(skip).limit(limit).all()

    def get_quiz_by_id(self, db: Session, quiz_id: int) -> Optional[Quiz]:
        return db.query(Quiz).filter(Quiz.id == quiz_id).first()

    def validate_url(self, url: str) -> dict:
        is_valid = self.scraper.validate_wikipedia_url(url)
        title = None
        
        if is_valid:
            title = self.scraper.get_title_preview(url)
        
        return {
            "valid": is_valid and title is not None,
            "title": title or ""
        }