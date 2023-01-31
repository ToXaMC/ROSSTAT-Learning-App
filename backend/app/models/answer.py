from datetime import datetime
from pydantic import UUID4, BaseModel
from app.models.utils import optional


class AnswerBase(BaseModel):
    title: str


class AnswerCreate(AnswerBase):
    is_correct: bool


class AnswerGet(AnswerCreate):
    guid: UUID4
    task_guid: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


@optional
class AnswerPatch(AnswerBase):
    pass
