import uuid
from sqlalchemy import Column, DateTime, ForeignKey, String, func, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.connection import Base


class Answer(Base):
    __tablename__ = 'answer'

    guid = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True, index=True, unique=True)
    task_guid = Column(UUID(as_uuid=True), ForeignKey('task.guid'))
    title = Column(String, nullable=False)
    is_correct = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    task = relationship('Task', back_populates='answers', uselist=False, lazy='joined')
