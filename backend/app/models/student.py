from sqlalchemy import Column, String, Date, Integer, Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class Branch(Base):
    __tablename__ = "branches"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    branch_code = Column(String(10), unique=True, nullable=False)
    degree = Column(String(10), nullable=False)
    branch_name = Column(String(150), nullable=False)
    short_name = Column(String(20), nullable=False)
    department = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Regulation(Base):
    __tablename__ = "regulations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    regulation_year = Column(Integer, unique=True, nullable=False)
    description = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Student(Base):
    __tablename__ = "students"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    register_number = Column(String(20), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id"), nullable=False)
    regulation_id = Column(UUID(as_uuid=True), ForeignKey("regulations.id"), nullable=False)
    batch_year = Column(Integer, nullable=False)
    current_semester = Column(Integer)
    email = Column(String(100), unique=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    branch = relationship("Branch")
    regulation = relationship("Regulation")