
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.competition import router as competition_router

app = FastAPI(
    title="Quiz Management System",
    description="Backend API for the Real-Time Quiz Competition Management System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(competition_router)


@app.get("/")
def root():
    return {
        "message": "Quiz Management System API",
        "status": "running",
    }


@app.get("/api/status")
def status():
    return {"status": "online"}
