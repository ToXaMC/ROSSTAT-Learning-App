from fastapi import APIRouter, Body, Depends, Path, Query
from pydantic import UUID4
from sqlalchemy.orm import Session
from starlette import status
from app.database.connection import get_session
from app.models import AnswerCreate, AnswerGet, AnswerPatch
from app.services import AnswerService
from app.services.auth import verify_access_token

router = APIRouter(prefix='/api/answer',
                   dependencies=[Depends(verify_access_token)]
                   )


@router.post(
    '/',
    response_model=AnswerGet,
    response_description='Ответ успешно создан',
    status_code=status.HTTP_201_CREATED,
    description='Создать ответа и вернуть его',
    summary='Создание ответа',
)
def create(
        id: UUID4 = Query(..., description='Id задачи'),
        model: AnswerCreate = Body(..., description='Тело ответа'),
        db: Session = Depends(get_session),
        answers_service: AnswerService = Depends(),
):
    return answers_service.create(db=db, guid=id, model=model)


@router.get(
    '/',
    response_model=list[AnswerGet],
    response_description='Успешный возврат списка ответов',
    status_code=status.HTTP_200_OK,
    description='Получить ответов всех студентов',
    summary='Получение всех ответов',
)
def get_all(
        db: Session = Depends(get_session),
        limit: int = Query(100, ge=1),
        offset: int = Query(0, ge=0),
        answers_service: AnswerService = Depends(),
):
    return answers_service.get_all(db=db, limit=limit, offset=offset)


@router.get(
    '/{id}',
    response_model=AnswerGet,
    response_description='Успешный возврат ответа',
    status_code=status.HTTP_200_OK,
    description='Получить ответа по его id',
    summary='Получение ответа по id',
)
def get(
        id: UUID4 = Path(None, description='Id ответа'),
        db: Session = Depends(get_session),
        answers_service: AnswerService = Depends(),
):
    return answers_service.get(db=db, guid=id)


@router.put(
    '/{id}',
    response_model=AnswerGet,
    response_description='Успешное обновление ответа',
    status_code=status.HTTP_200_OK,
    description='Изменить ответа по его id (полное обновление модели)',
    summary='Изменение ответа по id',
)
def update(
        model: AnswerCreate,
        id: UUID4 = Path(None, description='Id ответа'),
        db: Session = Depends(get_session),
        answers_service: AnswerService = Depends(),
):
    return answers_service.update(db=db, guid=id, model=model)


@router.patch(
    '/{id}',
    response_model=AnswerGet,
    response_description='Успешное частичное обновление ответа',
    status_code=status.HTTP_200_OK,
    description='Изменить ответа по его id (частисно обновление модели)',
    summary='Изменение ответа по id (только указанные поля будут изменены)',
)
def patch(
        model: AnswerPatch,
        id: UUID4 = Path(None, description='Id ответа'),
        db: Session = Depends(get_session),
        answers_service: AnswerService = Depends(),
):
    return answers_service.patch(db=db, guid=id, model=model)


@router.delete(
    '/{id}',
    response_description='Успешное удаление ответа',
    status_code=status.HTTP_204_NO_CONTENT,
    description='Удалить ответа по его id',
    summary='Удаление ответа по id',
)
def delete(
        id: UUID4 = Path(None, description='Id ответа'),
        db: Session = Depends(get_session),
        answers_service: AnswerService = Depends(),
):
    return answers_service.delete(db=db, guid=id)
