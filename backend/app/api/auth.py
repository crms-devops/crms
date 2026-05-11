from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token
from app.models.student import Student
from app.schemas.auth import StudentLoginRequest, LoginResponse, StudentInfo

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/student/login", response_model=LoginResponse)
def student_login(request: StudentLoginRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(
        Student.register_number == request.register_number
    ).first()

    if not student or student.date_of_birth != request.date_of_birth:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid register number or date of birth"
        )

    if not student.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student account is inactive"
        )

    token = create_access_token(data={
        "sub": student.register_number,
        "student_id": str(student.id)
    })

    return LoginResponse(
        access_token=token,
        student=StudentInfo(
            register_number=student.register_number,
            name=student.name,
            degree=student.branch.degree,
            branch_name=student.branch.branch_name,
            branch_code=student.branch.branch_code,
            regulation_year=student.regulation.regulation_year,
            current_semester=student.current_semester or 1
        )
    )