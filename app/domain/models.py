import pydantic
from datetime import datetime


class InterviewResultModel(pydantic.BaseModel):
    username: str = pydantic.Field(...)
    persona: str = pydantic.Field(...)
    skill: str = pydantic.Field(...)
    duration: int = pydantic.Field(...)
    created_at: datetime = pydantic.Field(...)
