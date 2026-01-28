from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(500), index=True)
    title = Column(String(300))
    summary = Column(Text)
    key_entities = Column(JSON)
    sections = Column(JSON)
    quiz_data = Column(JSON)
    related_topics = Column(JSON)
    difficulty = Column(String(20), default="mixed")
    raw_html = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())