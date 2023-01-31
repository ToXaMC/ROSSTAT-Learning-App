from pydantic import UUID4, BaseModel
from app.models.user import UserGet
from app.models.answer import AnswerCreate, AnswerGet
from app.models.utils import optional
from datetime import datetime


class TaskBase(BaseModel):
    title: str
    description: str
    points: int


class TaskCreate(TaskBase):
    image: str = \
        'https://avatars.mds.yandex.net/i?id=57a501702ff9428ecb4d39b35dc50ddd5624f1b9-8191765-images-thumbs&n=13'
    answers: list[AnswerCreate]


class TaskGet(TaskCreate):
    guid: UUID4
    author: UserGet
    is_active: bool
    answers: list[AnswerGet]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class TaskSolve(BaseModel):
    pass


@optional
class TaskPatch(TaskBase):
    pass
