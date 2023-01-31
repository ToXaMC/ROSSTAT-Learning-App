from __future__ import annotations
from datetime import datetime, timedelta
from uuid import uuid4
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
from jose.exceptions import JOSEError
from passlib.hash import bcrypt
from pydantic import UUID4
from sqlalchemy.orm import Session
from app.config import config
from app.models import Token, UserAuth, UserCreate, UserGet
from app.repositories import UserRepository

bearer_scheme = HTTPBearer()


def verify_access_token(access_token: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        jwt.decode(
            access_token.credentials,
            config.BACKEND_JWT_SECRET,
            algorithms=[config.BACKEND_JWT_ALGORITHM],
            options={'verify_aud': False},
        )
    except JOSEError:
        raise HTTPException(401, 'Неверный токен авторизации', headers={'WWW-Authenticate': 'Bearer'})


def get_user_from_access_token(request: Request) -> UUID4:
    access_token = request.headers['Authorization'].split()[1]
    info = jwt.decode(
        access_token,
        config.BACKEND_JWT_SECRET,
        algorithms=[config.BACKEND_JWT_ALGORITHM],
        options={'verify_aud': False},
    )
    return info['sub']


def get_role_from_access_token(request: Request) -> UUID4:
    access_token = request.headers['Authorization'].split()[1]
    info = jwt.decode(
        access_token,
        config.BACKEND_JWT_SECRET,
        algorithms=[config.BACKEND_JWT_ALGORITHM],
        options={'verify_aud': False},
    )
    return info['role']


def crypt_password(password: str) -> str:
    return bcrypt.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.verify(password, hashed_password)


def get_payload(user: UserGet) -> dict[str, datetime | str]:
    created_at = datetime.utcnow()
    expires_at = created_at + timedelta(minutes=config.BACKEND_JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        'exp': expires_at,
        'iat': created_at,
        'jti': str(uuid4()),
        'sub': str(user.guid),
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'middle_name': user.middle_name,
        'role': user.role,
    }


def create_access_token(payload: dict[str, datetime | str]) -> str:
    return jwt.encode(
        payload,
        config.BACKEND_JWT_SECRET,
        algorithm=config.BACKEND_JWT_ALGORITHM,
    )


class AuthService:
    def signin(self, db: Session, model: UserAuth) -> Token:
        user = UserRepository.get_user_by_email(db=db, email=model.email)

        if not user:
            raise HTTPException(401, 'Неверный логин или пароль')

        if not verify_password(model.password, user.password):
            raise HTTPException(401, 'Неверный логин или пароль')

        payload = get_payload(user=user)
        access_token = create_access_token(payload=payload)
        return Token(access_token=access_token)

    def signup(self, db: Session, model: UserCreate) -> Token:
        user = UserRepository.get_user_by_email(db=db, email=model.email)

        if user:
            raise HTTPException(409, 'User с таким email уже существует')

        hashed_password = crypt_password(model.password)
        model.password = hashed_password

        new_user = UserRepository.create(db, model)
        payload = get_payload(user=new_user)
        access_token = create_access_token(payload=payload)

        return Token(access_token=access_token)
