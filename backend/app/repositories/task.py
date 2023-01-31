from fastapi import HTTPException
from pydantic import UUID4
from sqlalchemy import BigInteger, delete, update
from sqlalchemy.future import select
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import cast
from app.database.tables import Task, Answer
from app.models import TaskCreate, TaskPatch
from app.repositories.answer import AnswerRepository
from app.repositories.user import UserRepository


class TaskRepository:
    @staticmethod
    def create(db: Session, model: TaskCreate, user: UUID4) -> Task:
        new_task = Task(
            title=model.title,
            description=model.description,
            image=model.image,
            points=model.points,
            user_guid=user,
            answers=list(),
        )
        for ans in model.answers:
            answer_object = Answer(
                title=ans.title,
                is_correct=ans.is_correct
            )
            new_task.answers.append(answer_object)

        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        return new_task

    @staticmethod
    def get_all(db: Session, offset: int = 0, limit: int = 100) -> list[Task]:
        res = db.execute(select(Task).offset(cast(offset, BigInteger)).limit(limit))
        return res.scalars().unique().all()

    @staticmethod
    def get(db: Session, guid: UUID4) -> Task:
        res = db.execute(select(Task).where(Task.guid == guid).limit(1))
        return res.scalar()

    @staticmethod
    def update(db: Session, guid: UUID4, model: TaskCreate) -> Task:
        task = TaskRepository.get(db, guid)

        if task is None:
            raise HTTPException(404, 'Задача не найдена')

        db.execute(
            update(Task).where(Task.guid == guid).values(**model.dict(exclude_unset=True, exclude={'answers'}))
        )
        db.commit()
        db.refresh(task)

        return task

    @staticmethod
    def patch(db: Session, guid: UUID4, model: TaskPatch) -> Task:
        task = TaskRepository.get(db, guid)

        if task is None:
            raise HTTPException(404, 'Задача не найдена')

        if model is None or not model.dict(exclude_unset=True):
            raise HTTPException(400, 'Должно быть задано хотя бы одно новое поле модели')

        db.execute(
            update(Task).where(Task.guid == guid).values(**model.dict(exclude_unset=True, exclude={'answers'}))
        )

        for ans in model.answers:
            AnswerRepository.patch(db, ans.guid, ans)

        db.commit()
        db.refresh(task)

        return task

    @staticmethod
    def delete(db: Session, guid: UUID4) -> None:
        db.execute(delete(Task).where(Task.guid == guid))
        db.commit()

    @staticmethod
    def solve(db: Session, guid: UUID4, user: UUID4) -> None:
        task = TaskRepository.get(db, guid)
        user = UserRepository.get(db, user)

        if task is None:
            raise HTTPException(404, 'Задача не найдена')

        # if model is None or not model.dict(exclude_unset=True):
        #     raise HTTPException(400, 'Должно быть задано хотя бы одно новое поле модели')

        task.is_active = False
        user.points += task.points

        db.commit()
        db.refresh(task)
        db.refresh(user)

        return task
