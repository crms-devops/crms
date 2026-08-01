"""seed initial data SIET branches regulation exam session

Revision ID: 48ed56993fac
Revises: 77c2289aa6df
Create Date: 2026-08-01 13:50:00.157108

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '48ed56993fac'
down_revision: Union[str, Sequence[str], None] = '77c2289aa6df'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        INSERT INTO branches (id, branch_code, degree, branch_name, short_name, department, created_at)
        VALUES (gen_random_uuid(), '149', 'B.E.',
                'Computer Science and Engineering(Cyber Security)',
                'CSE-CY', 'CSE', now())
        ON CONFLICT (branch_code) DO NOTHING;
    """)
    op.execute("""
        INSERT INTO regulations (id, regulation_year, description, is_active, created_at)
        VALUES (gen_random_uuid(), 2021, 'Anna University Regulation 2021', true, now())
        ON CONFLICT (regulation_year) DO NOTHING;
    """)
    op.execute("""
        INSERT INTO exam_sessions (id, session_name, exam_year, display_label, is_published, created_at)
        VALUES (gen_random_uuid(), 'NOV_DEC', 2025,
                'Nov/Dec 2025 END SEMESTER EXAMINATION RESULTS', true, now())
        ON CONFLICT (session_name, exam_year) DO NOTHING;
    """)

def downgrade() -> None:
    op.execute("DELETE FROM exam_sessions WHERE session_name = 'NOV_DEC' AND exam_year = 2025")
    op.execute("DELETE FROM regulations WHERE regulation_year = 2021")
    op.execute("DELETE FROM branches WHERE branch_code = '149'")