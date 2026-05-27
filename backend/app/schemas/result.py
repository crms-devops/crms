from pydantic import BaseModel, ConfigDict
from typing import List, Optional


class ResultItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    semester: int
    subject_code: str
    subject_name: str
    subject_type: str
    grade: Optional[str] = None
    marks_obtained: Optional[float] = None
    result_status: str
    attempt_number: int


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