from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api import auth, results
from app.core.kafka import start_kafka_producer, stop_kafka_producer
from prometheus_fastapi_instrumentator import Instrumentator


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_kafka_producer()  
    yield
    stop_kafka_producer()   


app = FastAPI(
    title="CRMS API",
    description="College Result Management System",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost",
        "http://localhost:80",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator().instrument(app).expose(app)

app.include_router(auth.router)
app.include_router(results.router)


@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0"}