from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ResultItem(BaseModel):
    semester: int
    subject_code: str
    subject_name: str
    subject_type: str
    grade: Optional[str]
    marks_obtained: Optional[float]
    result_status: str
    attempt_number: int

    class Config:
        from_attributes = True

class ExamSessionInfo(BaseModel):
    display_label: str
    session_name: str
    exam_year: int

class ResultsResponse(BaseModel):
    student_name: str
    register_number: str
    degree: str
    branch_name: str
    branch_code: str
    regulation_year: int
    exam_session: ExamSessionInfo
    results: List[ResultItem]