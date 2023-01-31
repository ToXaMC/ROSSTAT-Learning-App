import uuid
from sqlalchemy import Boolean, Column, DateTime, Integer, String, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.connection import Base


class Task(Base):
    __tablename__ = 'task'

    guid = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True, index=True, unique=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    image = Column(String, nullable=False)
    points = Column(Integer, nullable=False)
    user_guid = Column(UUID(as_uuid=True), ForeignKey('user.guid'))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    author = relationship('User', back_populates='task', uselist=False, lazy="joined")
    answers = relationship('Answer', back_populates='task', uselist=True, lazy="joined")
