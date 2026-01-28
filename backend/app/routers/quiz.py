from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import QuizCreate, QuizResponse, QuizListItem, URLValidation, URLPreview
from app.services.quiz_service import QuizService

router = APIRouter(prefix="/api/quiz", tags=["quiz"])
quiz_service = QuizService()


@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(quiz_input: QuizCreate, db: Session = Depends(get_db)):
    try:
        quiz = await quiz_service.generate_quiz_async(
            db, 
            str(quiz_input.url),
            quiz_input.difficulty.value,
            quiz_input.num_questions
        )
        return {
            "id": quiz.id,
            "url": quiz.url,
            "title": quiz.title,
            "summary": quiz.summary,
            "key_entities": quiz.key_entities,
            "sections": quiz.sections,
            "quiz": quiz.quiz_data,
            "related_topics": quiz.related_topics,
            "difficulty": quiz.difficulty,
            "created_at": quiz.created_at
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.get("/history", response_model=List[QuizListItem])
async def get_quiz_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    quizzes = quiz_service.get_all_quizzes(db, skip, limit)
    return [{
        "id": q.id,
        "url": q.url,
        "title": q.title,
        "difficulty": q.difficulty or "mixed",
        "created_at": q.created_at
    } for q in quizzes]


@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = quiz_service.get_quiz_by_id(db, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return {
        "id": quiz.id,
        "url": quiz.url,
        "title": quiz.title,
        "summary": quiz.summary,
        "key_entities": quiz.key_entities,
        "sections": quiz.sections,
        "quiz": quiz.quiz_data,
        "related_topics": quiz.related_topics,
        "difficulty": quiz.difficulty or "mixed",
        "created_at": quiz.created_at
    }


@router.post("/validate", response_model=URLPreview)
async def validate_url(url_input: URLValidation):
    result = quiz_service.validate_url(str(url_input.url))
    return result