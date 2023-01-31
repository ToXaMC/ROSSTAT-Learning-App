from fastapi import HTTPException
from pydantic import UUID4, EmailStr
from sqlalchemy import BigInteger, delete, update
from sqlalchemy.future import select
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import cast
from app.database.tables import User
from app.models import UserCreate, UserPatch


class UserRepository:
    @staticmethod
    def create(db: Session, model: UserCreate) -> User:
        user = User(**model.dict(exclude_unset=True))
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_all(db: Session, offset: int = 0, limit: int = 100) -> list[User]:
        res = db.execute(select(User).offset(cast(offset, BigInteger)).limit(limit))
        return res.scalars().unique().all()

    @staticmethod
    def get(db: Session, guid: UUID4) -> User:
        res = db.execute(select(User).where(User.guid == guid).limit(1))
        return res.scalar()

    @staticmethod
    def get_user_by_email(db: Session, email: EmailStr) -> User:
        res = db.execute(select(User).where(User.email == email).limit(1))
        return res.scalar()

    @staticmethod
    def update(db: Session, guid: UUID4, model: UserCreate) -> User:
        user = UserRepository.get(db, guid)

        if user is None:
            raise HTTPException(404, 'Пользователь не найден')

        from app.services.auth import crypt_password

        model.password = crypt_password(model.password)

        db.execute(update(User).where(User.guid == guid).values(**model.dict()))
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def patch(db: Session, guid: UUID4, model: UserPatch) -> User:
        user = UserRepository.get(db, guid)

        if user is None:
            raise HTTPException(404, 'Пользователь не найден')

        if model is None or not model.dict(exclude_unset=True):
            raise HTTPException(400, 'Должно быть задано хотя бы одно новое поле модели')

        db.execute(update(User).where(User.guid == guid).values(**model.dict()))
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def delete(db: Session, guid: UUID4) -> None:
        db.execute(delete(User).where(User.guid == guid))
        db.commit()
