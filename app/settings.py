from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    OPENAI_API_KEY: str
    POSTGRES_DSN: str = "postgres://postgres:postgres@postgres:5432/assistant"
    DB_SCHEMA: str = "public"
    DB_TABLE: str = "users"
    SECRET_KEY: str = "SECRET_KEY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


settings = Settings()
