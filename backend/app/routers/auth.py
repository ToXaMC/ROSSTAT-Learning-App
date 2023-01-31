from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session
from starlette import status
from app.database import get_session
from app.models import Token, UserAuth, UserCreate
from app.services.auth import AuthService

router = APIRouter(prefix='/api')


@router.post(
    '/signin',
    response_model=Token,
    response_description='Успешный возврат токена авторизации',
    status_code=status.HTTP_200_OK,
    description='Войти в сервис и получить токен',
    summary='Вход в сервис',
)
def signin(
        model: UserAuth = Body(..., description='Данные пользователя'),
        db: Session = Depends(get_session),
        auth_service: AuthService = Depends(),
):
    return auth_service.signin(db=db, model=model)


@router.post(
    '/signup',
    response_model=Token,
    response_description='Успешный возврат токена авторизации',
    status_code=status.HTTP_200_OK,
    description='Зарегистирироваться в сервисе и получить токен',
    summary='Регистрация в сервисе',
)
def signup(
        model: UserCreate = Body(..., description='Данные пользователя'),
        db: Session = Depends(get_session),
        auth_service: AuthService = Depends(),
):
    return auth_service.signup(db=db, model=model)

# ======== Test access_token ========
# {
# 'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzYzMjQ3MzksImlhdCI6MTY3NTExNTEzOSwianRpIjoiYzJjMGE0ZjYtOGFjMi00MGQzLTk2YjQtNGY1ZTg5MjcyNjdhIiwic3ViIjoiYjE3NDFjZWQtNzQ3Ny00MzY4LTk2ZDQtYTkwMDgzM2UzYjQ1IiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZmlyc3RfbmFtZSI6InN0cmluZyIsImxhc3RfbmFtZSI6InN0cmluZyIsIm1pZGRsZV9uYW1lIjoic3RyaW5nIiwicm9sZSI6InVzZXIifQ.1cLCOCoJkyJusYep2Xbbxk-pzo2ns1zpd7BPaL7ca64'
# }
