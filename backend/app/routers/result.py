from fastapi import APIRouter, Depends, Path
from pydantic import UUID4
from sqlalchemy.orm import Session
from starlette import status
from app.database.connection import get_session
from app.services import TaskService

router = APIRouter(prefix='/api/task/solve/result')


@router.get(
    '/{id}',
    response_description='Получить результаты опроса',
    status_code=status.HTTP_200_OK,
    description='Получить результаты опроса',
    summary='Получение результатов опроса',
)
def results(
        id: UUID4 = Path(None, description='Id опроса'),
        db: Session = Depends(get_session),
        surveys_service: TaskService = Depends(),
):
    return surveys_service.results(db=db, guid=id)
