from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime
from enum import Enum


class DifficultyLevel(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"
    mixed = "mixed"


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: str
    explanation: str


class KeyEntities(BaseModel):
    people: List[str] = []
    organizations: List[str] = []
    locations: List[str] = []


class QuizCreate(BaseModel):
    url: HttpUrl
    difficulty: DifficultyLevel = DifficultyLevel.mixed
    num_questions: int = 6


class QuizResponse(BaseModel):
    id: int
    url: str
    title: str
    summary: str
    key_entities: KeyEntities
    sections: List[str]
    quiz: List[QuizQuestion]
    related_topics: List[str]
    difficulty: str
    created_at: datetime

    class Config:
        from_attributes = True


class QuizListItem(BaseModel):
    id: int
    url: str
    title: str
    difficulty: str
    created_at: datetime

    class Config:
        from_attributes = True


class URLValidation(BaseModel):
    url: HttpUrl


class URLPreview(BaseModel):
    title: str
    valid: bool