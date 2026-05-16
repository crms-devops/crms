from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, results

app = FastAPI(
    title="CRMS API",
    description="College Result Management System",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(results.router)

@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0"}