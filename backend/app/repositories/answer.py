from typing import List
from fastapi import HTTPException
from pydantic import UUID4
from sqlalchemy import BigInteger, delete, update
from sqlalchemy.future import select
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import cast
from app.database.tables import Answer
from app.models import AnswerCreate, AnswerPatch


class AnswerRepository:
    @staticmethod
    def create(db: Session, model: AnswerCreate) -> Answer:
        answer = Answer(**model.dict(exclude_unset=True))
        db.add(answer)
        db.commit()
        db.refresh(answer)
        return answer

    @staticmethod
    def get_all(db: Session, offset: int = 0, limit: int = 100) -> List[Answer]:
        res = db.execute(select(Answer).offset(cast(offset, BigInteger)).limit(limit))
        return res.scalars().unique().all()

    @staticmethod
    def get(db: Session, guid: UUID4) -> Answer:
        res = db.execute(select(Answer).where(Answer.guid == guid).limit(1))
        return res.scalar()

    @staticmethod
    def update(db: Session, guid: UUID4, model: AnswerCreate) -> Answer:
        answer = AnswerRepository.get(db, guid)

        if answer is None:
            raise HTTPException(404, 'Ответ не найден')

        db.execute(update(Answer).where(Answer.guid == guid).values(**model.dict()))
        db.commit()
        db.refresh(answer)

        return answer

    @staticmethod
    def patch(db: Session, guid: UUID4, model: AnswerPatch) -> Answer:
        answer = AnswerRepository.get(db, guid)

        if answer is None:
            raise HTTPException(404, 'Ответ не найден')

        if model is None or not model.dict(exclude_unset=True):
            raise HTTPException(400, 'Должно быть задано хотя бы одно новое поле модели')

        db.execute(update(Answer).where(Answer.guid == guid).values(**model.dict()))
        db.commit()
        db.refresh(answer)

        return answer

    @staticmethod
    def delete(db: Session, guid: UUID4) -> None:
        db.execute(delete(Answer).where(Answer.guid == guid))
        db.commit()
