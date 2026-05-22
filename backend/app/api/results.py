from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.security import get_current_student
from app.models.student import Student
from app.models.result import Result, ExamSession
from app.schemas.result import ResultsResponse, ResultItem, ExamSessionInfo

router = APIRouter(prefix="/results", tags=["results"])

@router.get("/me", response_model=ResultsResponse)
def get_my_results(
    semester: int = None,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    session = db.query(ExamSession).filter(
        ExamSession.is_published == True
    ).order_by(ExamSession.exam_year.desc()).first()

    if not session:
        raise HTTPException(status_code=404, detail="No published results found")

    query = db.query(Result).filter(
        Result.student_id == current_student.id,
        Result.exam_session_id == session.id,
        Result.published_at != None
    ).options(joinedload(Result.subject), joinedload(Result.exam_session))

    if semester:
        query = query.filter(Result.semester == semester)

    results = query.order_by(Result.semester).all()

    return ResultsResponse(
        student_name=current_student.name,
        register_number=current_student.register_number,
        degree=current_student.branch.degree,
        branch_name=current_student.branch.branch_name,
        branch_code=current_student.branch.branch_code,
        regulation_year=current_student.regulation.regulation_year,
        exam_session=ExamSessionInfo(
            display_label=session.display_label,
            session_name=session.session_name,
            exam_year=session.exam_year
        ),
        results=[
            ResultItem(
                semester=r.semester,
                subject_code=r.subject.subject_code,
                subject_name=r.subject.subject_name,
                subject_type=r.subject.subject_type,
                grade=r.grade,
                marks_obtained=float(r.marks_obtained) if r.marks_obtained else None,
                result_status=r.result_status,
                attempt_number=r.attempt_number
            ) for r in results
        ]
    )