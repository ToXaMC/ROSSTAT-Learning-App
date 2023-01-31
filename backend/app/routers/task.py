from fastapi import APIRouter, Depends, Path, Query, Request
from pydantic import UUID4
from sqlalchemy.orm import Session
from starlette import status
from app.database import get_session
from app.models import TaskCreate, TaskGet, TaskPatch
from app.services.auth import verify_access_token, get_user_from_access_token
from app.services import TaskService

router = APIRouter(prefix='/api/task',
                   dependencies=[Depends(verify_access_token)]
                   )


@router.post(
    '/',
    response_model=TaskGet,
    response_description='Задача успешно создана',
    status_code=status.HTTP_201_CREATED,
    description='Создать задачу и вернуть её',
    summary='Создание задачи',
)
async def create(
        model: TaskCreate,
        guid: UUID4 = Depends(get_user_from_access_token),
        db: Session = Depends(get_session),
        tasks_service: TaskService = Depends(),
):
    return tasks_service.create(db=db, model=model, user=guid)


@router.get(
    '/',
    response_model=list[TaskGet],
    response_description='Успешный возврат списка задач',
    status_code=status.HTTP_200_OK,
    description='Получить все задачи',
    summary='Получение всех задач',
)
async def get_all(
        db: Session = Depends(get_session),
        limit: int = Query(100, ge=1),
        offset: int = Query(0, ge=0),
        tasks_service: TaskService = Depends(),
):
    return tasks_service.get_all(db=db, limit=limit, offset=offset)


@router.get(
    '/{id}',
    response_model=TaskGet,
    response_description='Успешный возврат задачи',
    status_code=status.HTTP_200_OK,
    description='Получить задачу по id',
    summary='Получение задачи по id',
)
async def get(
        id: UUID4 = Path(None, description='Id задачи'),
        db: Session = Depends(get_session),
        tasks_service: TaskService = Depends(),
):
    return tasks_service.get(db=db, guid=id)


@router.patch(
    '/{id}',
    response_model=TaskGet,
    response_description='Успешное частичное обновление задачи',
    status_code=status.HTTP_200_OK,
    description='Изменить задачу по id (частичное обновление модели)',
    summary='Изменение задачи по id (только указанные поля будут изменены)',
)
async def patch(
        model: TaskPatch,
        id: UUID4 = Path(None, description='Id задачи'),
        db: Session = Depends(get_session),
        tasks_service: TaskService = Depends(),
):
    return tasks_service.patch(db=db, guid=id, model=model)


@router.delete(
    '/{id}',
    response_description='Успешное удаление задачи',
    status_code=status.HTTP_204_NO_CONTENT,
    description='Удалить задачу по id',
    summary='Удаление задачи по id',
)
async def delete_task(
        id: UUID4 = Path(None, description='Id задачи'),
        db: Session = Depends(get_session),
        tasks_service: TaskService = Depends(),
):
    return tasks_service.delete(db=db, guid=id)
