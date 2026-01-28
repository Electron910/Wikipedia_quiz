from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://postgres:dhanvyn@localhost:5432/wiki_quiz"
    gemini_api_key: str = "AIzaSyDrO2R-0NaULs7j8sAj_WT2Tyj4z0XYvZI"
    app_name: str = "Wiki Quiz App"
    debug: bool = True

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()