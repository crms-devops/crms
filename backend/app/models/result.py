from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid
import enum

class ResultStatus(str, enum.Enum):
    PASS = "PASS"
    RA_FAIL = "RA_FAIL"
    RA_ABSENT = "RA_ABSENT"
    WH_WITHHELD = "WH_WITHHELD"
    WH1_MALPRACTICE = "WH1_MALPRACTICE"
    NC_NO_CHANGE = "NC_NO_CHANGE"

class ExamSession(Base):
    __tablename__ = "exam_sessions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_name = Column(String(20), nullable=False)
    exam_year = Column(Integer, nullable=False)
    display_label = Column(String(60), nullable=False)
    is_published = Column(String, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_code = Column(String(20), unique=True, nullable=False)
    subject_name = Column(String(150), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id"))
    regulation_id = Column(UUID(as_uuid=True), ForeignKey("regulations.id"))
    semester = Column(Integer, nullable=False)
    subject_type = Column(String(10), nullable=False)
    credits = Column(Integer, nullable=False)

class Result(Base):
    __tablename__ = "results"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"), nullable=False)
    exam_session_id = Column(UUID(as_uuid=True), ForeignKey("exam_sessions.id"), nullable=False)
    semester = Column(Integer, nullable=False)
    grade = Column(String(5))
    marks_obtained = Column(Numeric(5, 2))
    max_marks = Column(Numeric(5, 2), default=100)
    result_status = Column(String, nullable=False)
    attempt_number = Column(Integer, default=1)
    published_at = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    subject = relationship("Subject")
    exam_session = relationship("ExamSession")