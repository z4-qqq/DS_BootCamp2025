from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    POSTGRES_DSN: str = "postgres://postgres:postgres@postgres:5432/assistant"
