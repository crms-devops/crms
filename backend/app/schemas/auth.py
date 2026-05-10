from pydantic import BaseModel
from datetime import date

class StudentLoginRequest(BaseModel):
    register_number: str
    date_of_birth: date

class StudentInfo(BaseModel):
    register_number: str
    name: str
    degree: str
    branch_name: str
    branch_code: str
    regulation_year: int
    current_semester: int

    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 3600
    student: StudentInfo