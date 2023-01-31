from __future__ import annotations
import io
import matplotlib.pyplot as plt
from fastapi import HTTPException, Response
from pydantic import UUID4
from sqlalchemy.orm import Session
from app.models import TaskCreate, TaskGet, TaskPatch
from app.repositories import TaskRepository


class TaskService:
    @staticmethod
    def create(db: Session, model: TaskCreate, user: UUID4) -> TaskGet:
        task = TaskRepository.create(db, model, user)
        return TaskGet.from_orm(task)

    @staticmethod
    def get_all(db: Session, offset: int = 0, limit: int = 100) -> list[TaskGet]:
        tasks = TaskRepository.get_all(db, offset=offset, limit=limit)
        if tasks is None:
            raise HTTPException(404, 'Задачи не найдены')
        return [TaskGet.from_orm(s) for s in tasks]

    @staticmethod
    def get(db: Session, guid: UUID4) -> TaskGet:
        task = TaskRepository.get(db, guid)
        if task is None:
            raise HTTPException(404, 'Задача не найдена')
        return TaskGet.from_orm(task)

    @staticmethod
    def update(db: Session, guid: UUID4, model: TaskCreate) -> TaskGet:
        task = TaskRepository.update(db, guid, model)
        if task is None:
            raise HTTPException(404, 'Задача не найдена')
        return TaskGet.from_orm(task)

    @staticmethod
    def patch(db: Session, guid: UUID4, model: TaskPatch) -> TaskGet:
        task = TaskRepository.patch(db, guid, model)
        if task is None:
            raise HTTPException(404, 'Задача не найдена')
        return TaskGet.from_orm(task)

    @staticmethod
    def delete(db: Session, guid: UUID4) -> Response(status_code=204):
        TaskRepository.delete(db, guid)
        return Response(status_code=204)

    @staticmethod
    def solve(db: Session, guid: UUID4, user: UUID4) -> Response(status_code=200):
        task = TaskRepository.solve(db, guid, user)
        if task is None:
            raise HTTPException(404, 'Задача не найдена')
        # return TaskGet.from_orm(task)
        return Response(status_code=200)

    @staticmethod
    def results(db: Session, guid: UUID4) -> Response:
        task = TaskRepository.get(db, guid)
        fig, ax = plt.subplots()

        answers = [answer.title for answer in task.answers]
        voted = [answer.is_correct for answer in task.answers]

        ax.bar(answers, voted)
        ax.set_ylabel('Amount of votes')
        ax.set_title(f'Vote results for {guid}')

        task_bar = io.BytesIO()
        plt.savefig(task_bar, format='png')
        task_bar.seek(0)
        return Response(content=task_bar.read(), media_type='image/png')
