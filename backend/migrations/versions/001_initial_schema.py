"""initial schema — all 7 tables

Revision ID: 001
Revises: 
Create Date: 2026-07-14
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create ENUM first
    op.execute("CREATE TYPE result_status_enum AS ENUM ('PASS', 'RA_FAIL', 'RA_ABSENT', 'WH_WITHHELD', 'WH1_MALPRACTICE', 'NC_NO_CHANGE')" if not op.get_bind().execute(sa.text("SELECT 1 FROM pg_type WHERE typname = 'result_status_enum'")).fetchone() else "SELECT 1")

    op.create_table('branches',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('branch_code', sa.String(10), unique=True, nullable=False),
        sa.Column('degree', sa.String(10), nullable=False),
        sa.Column('branch_name', sa.String(150), nullable=False),
        sa.Column('short_name', sa.String(20), nullable=False),
        sa.Column('department', sa.String(50), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )

    op.create_table('regulations',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('regulation_year', sa.Integer(), unique=True, nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )

    op.create_table('exam_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('session_name', sa.String(20), nullable=False),
        sa.Column('exam_year', sa.Integer(), nullable=False),
        sa.Column('display_label', sa.String(60), nullable=False),
        sa.Column('is_published', sa.Boolean(), server_default=sa.text('false')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.UniqueConstraint('session_name', 'exam_year'),
    )

    op.create_table('students',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('register_number', sa.String(20), unique=True, nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('date_of_birth', sa.Date(), nullable=False),
        sa.Column('branch_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('branches.id'), nullable=False),
        sa.Column('regulation_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('regulations.id'), nullable=False),
        sa.Column('batch_year', sa.Integer(), nullable=False),
        sa.Column('current_semester', sa.Integer()),
        sa.Column('email', sa.String(100), unique=True),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )

    op.create_table('subjects',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('subject_code', sa.String(20), unique=True, nullable=False),
        sa.Column('subject_name', sa.String(150), nullable=False),
        sa.Column('branch_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('branches.id'), nullable=False),
        sa.Column('regulation_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('regulations.id'), nullable=False),
        sa.Column('semester', sa.Integer(), nullable=False),
        sa.Column('subject_type', sa.String(10), nullable=False),
        sa.Column('credits', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )

    op.create_table('results',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('students.id'), nullable=False),
        sa.Column('subject_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('subjects.id'), nullable=False),
        sa.Column('exam_session_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('exam_sessions.id'), nullable=False),
        sa.Column('semester', sa.Integer(), nullable=False),
        sa.Column('grade', sa.String(5)),
        sa.Column('marks_obtained', sa.Numeric(5, 2)),
        sa.Column('max_marks', sa.Numeric(5, 2), server_default=sa.text('100'), nullable=False),
        sa.Column('result_status', sa.String(), nullable=False),
        sa.Column('attempt_number', sa.Integer(), server_default=sa.text('1'), nullable=False),
        sa.Column('published_at', sa.DateTime()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.UniqueConstraint('student_id', 'subject_id', 'exam_session_id'),
    )

    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('email', sa.String(100), unique=True, nullable=False),
        sa.Column('hashed_password', sa.Text(), nullable=False),
        sa.Column('role', sa.String(20), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )

    # Indexes
    op.create_index('idx_students_register_number', 'students', ['register_number'])
    op.create_index('idx_results_student_semester', 'results', ['student_id', 'semester'])
    op.create_index('idx_results_published_at', 'results', ['published_at'])
    op.create_index('idx_subjects_code', 'subjects', ['subject_code'])


def downgrade() -> None:
    op.drop_table('results')
    op.drop_table('subjects')
    op.drop_table('students')
    op.drop_table('exam_sessions')
    op.drop_table('regulations')
    op.drop_table('branches')
    op.drop_table('users')
    op.execute("DROP TYPE result_status_enum")