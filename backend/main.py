import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routes import applications, cv, generate

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-Powered Job Application Assistant")

origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv.router, prefix="/api")
app.include_router(generate.router, prefix="/api")
app.include_router(applications.router, prefix="/api")


@app.get("/health")
def health_check():
    return {"status": "ok"}
