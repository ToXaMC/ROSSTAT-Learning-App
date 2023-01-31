from fastapi import APIRouter, Path, Depends
from sqlalchemy.orm import Session
from starlette import status
from pydantic import UUID4
from app.database import get_session
from app.services import TaskService
from app.services.auth import get_user_from_access_token, verify_access_token

router = APIRouter(prefix='/api/task/solve',
                   dependencies=[Depends(verify_access_token)]
                   )


@router.post(
    '/{id}',
    # response_model=TaskGet,
    response_description='Задача успешно решена',
    status_code=status.HTTP_201_CREATED,
    description='Решить задачу',
    summary='Решение задачи',
    # responses={},
)
async def solve(
        id: UUID4 = Path(None, description='Id задачи'),
        user: UUID4 = Depends(get_user_from_access_token),
        db: Session = Depends(get_session),
        tasks_service: TaskService = Depends(),
):
    return tasks_service.solve(db=db, guid=id, user=user)
