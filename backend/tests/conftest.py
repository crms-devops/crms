import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import engine, Base

from app.models.student import Student, Branch, Regulation
from app.models.result import Result, Subject, ExamSession


@pytest.fixture(scope="session", autouse=True)
def create_tables():
    """Create all tables before tests run, drop after."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)