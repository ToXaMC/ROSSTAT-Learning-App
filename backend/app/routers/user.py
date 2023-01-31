from fastapi import APIRouter, Depends, Query
from pydantic import UUID4
from sqlalchemy.orm import Session
from starlette import status
from app.database import get_session
from app.models import UserGet
from app.services.auth import get_user_from_access_token, verify_access_token
from app.services import UserService

router = APIRouter(prefix='/api/user',
                   dependencies=[Depends(verify_access_token)]
                   )


@router.get(
    '/',
    response_model=list[UserGet],
    response_model_exclude={'password'},
    response_description='Успешный возврат списка пользователей',
    status_code=status.HTTP_200_OK,
    description='Получить всех пользователей',
    summary='Получение всех пользователей',
    # responses={},
)
async def get_all(
        db: Session = Depends(get_session),
        limit: int = Query(100, ge=1),
        offset: int = Query(0, ge=0),
        users_service: UserService = Depends(),
):
    return users_service.get_all(db=db, limit=limit, offset=offset)


@router.get(
    '/me',
    response_model=UserGet,
    response_model_exclude={'password'},
    response_description='Успешный возврат пользователя',
    status_code=status.HTTP_200_OK,
    description='Получить свои данные',
    summary='Получение своих данных',
)
async def get(
        guid: UUID4 = Depends(get_user_from_access_token),
        db: Session = Depends(get_session),
        users_service: UserService = Depends(),
):
    return users_service.get(db=db, guid=guid)
