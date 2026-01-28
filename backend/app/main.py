# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.database import engine, Base
# from app.routers import quiz
# from app.config import get_settings

# settings = get_settings()

# Base.metadata.create_all(bind=engine)

# app = FastAPI(
#     title=settings.app_name,
#     description="Generate quizzes from Wikipedia articles using AI",
#     version="1.0.0"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(quiz.router)


# @app.get("/")
# async def root():
#     return {"message": "Wiki Quiz API", "status": "running"}


# @app.get("/health")
# async def health_check():
#     return {"status": "healthy"}





from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database import engine, Base
from app.routers import quiz
from app.config import get_settings
import os

settings = get_settings()

def run_migrations():
    """Run database migrations to add missing columns"""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'quizzes' AND column_name = 'difficulty'
            """))
            
            if result.fetchone() is None:
                print("Adding 'difficulty' column...")
                conn.execute(text("""
                    ALTER TABLE quizzes 
                    ADD COLUMN difficulty VARCHAR(20) DEFAULT 'mixed'
                """))
                conn.commit()
                print("Migration completed!")
    except Exception as e:
        print(f"Migration check: {e}")

Base.metadata.create_all(bind=engine)
run_migrations()

app = FastAPI(
    title=settings.app_name,
    description="Generate quizzes from Wikipedia articles using AI",
    version="1.0.0"
)

allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://*.vercel.app",
    "https://*.netlify.app",
]

frontend_url = os.getenv("FRONTEND_URL", "")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quiz.router)


@app.get("/")
async def root():
    return {"message": "Wiki Quiz API", "status": "running", "docs": "/docs"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}