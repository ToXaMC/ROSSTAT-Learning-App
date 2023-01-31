from __future__ import annotations
from fastapi import HTTPException, Response
from pydantic import UUID4
from sqlalchemy.orm import Session
from app.models import AnswerCreate, AnswerGet, AnswerPatch
from app.repositories import AnswerRepository, TaskRepository


class AnswerService:
    @staticmethod
    def create(db: Session, guid: UUID4, model: AnswerCreate) -> AnswerGet:
        task = TaskRepository.get(db, guid)
        if task is None:
            raise HTTPException(404, 'Задача не найдена')
        answer = AnswerRepository.create(db, model)
        return AnswerGet.from_orm(answer)

    @staticmethod
    def get_all(db: Session, offset: int = 0, limit: int = 100) -> list[AnswerGet]:
        answers = AnswerRepository.get_all(db, offset=offset, limit=limit)
        if answers is None:
            raise HTTPException(404, 'Ответы не найдены')
        return [AnswerGet.from_orm(a) for a in answers]

    @staticmethod
    def get(db: Session, guid: UUID4) -> AnswerGet:
        answer = AnswerRepository.get(db, guid)
        if answer is None:
            raise HTTPException(404, 'Ответ не найден')
        return AnswerGet.from_orm(answer)

    @staticmethod
    def update(db: Session, guid: UUID4, model: AnswerCreate) -> AnswerGet:
        answer = AnswerRepository.update(db, guid, model)
        if answer is None:
            raise HTTPException(404, 'Ответ не найден')
        return AnswerGet.from_orm(answer)

    @staticmethod
    def patch(db: Session, guid: UUID4, model: AnswerPatch) -> AnswerGet:
        answer = AnswerRepository.patch(db, guid, model)
        if answer is None:
            raise HTTPException(404, 'Ответ не найден')
        return AnswerGet.from_orm(answer)

    @staticmethod
    def delete(db: Session, guid: UUID4) -> Response(status_code=204):
        AnswerRepository.delete(db, guid)
        return Response(status_code=204)
