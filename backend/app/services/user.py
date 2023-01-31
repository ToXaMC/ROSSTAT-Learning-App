from __future__ import annotations
from fastapi import HTTPException, Response
from pydantic import UUID4, EmailStr
from sqlalchemy.orm import Session
from app.models import UserCreate, UserGet, UserPatch
from app.repositories import UserRepository


class UserService:
    @staticmethod
    def create(db: Session, model: UserCreate) -> UserGet:
        user = UserRepository.get_user_by_email(db, model.email)
        if user is not None:
            raise HTTPException(409, 'Пользователь с таким email уже существует')
        else:
            user = UserRepository.create(db, model)
        return UserGet.from_orm(user)

    @staticmethod
    def get_all(db: Session, offset: int = 0, limit: int = 100) -> list[UserGet]:
        users = UserRepository.get_all(db, offset=offset, limit=limit)
        if users is None:
            raise HTTPException(404, 'Пользователи не найдены')
        return [UserGet.from_orm(s) for s in users]

    @staticmethod
    def get(db: Session, guid: UUID4) -> UserGet:
        user = UserRepository.get(db, guid)
        if user is None:
            raise HTTPException(404, 'Пользователь не найден')
        return UserGet.from_orm(user)

    @staticmethod
    def get_user_by_email(db: Session, email: EmailStr) -> UserGet:
        user = UserRepository.get_user_by_email(db, email)
        if user is None:
            raise HTTPException(404, 'Пользователь не найден')
        return UserGet.from_orm(user)

    @staticmethod
    def update(db: Session, guid: UUID4, model: UserCreate) -> UserGet:
        user = UserRepository.update(db, guid, model)
        if user is None:
            raise HTTPException(404, 'Пользователь не найден')
        return UserGet.from_orm(user)

    @staticmethod
    def patch(db: Session, guid: UUID4, model: UserPatch) -> UserGet:
        user = UserRepository.patch(db, guid, model)
        if user is None:
            raise HTTPException(404, 'Пользователь не найден')
        return UserGet.from_orm(user)

    @staticmethod
    def delete(db: Session, guid: UUID4) -> Response(status_code=204):
        UserRepository.delete(db, guid)
        return Response(status_code=204)
