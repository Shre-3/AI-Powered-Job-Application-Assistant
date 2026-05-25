from fastapi import APIRouter, HTTPException

from schemas import GeneratedDocuments, GenerateRequest, RegenerateRequest
from services.openai_service import generate_documents

router = APIRouter(prefix="/generate", tags=["generate"])


@router.post("", response_model=GeneratedDocuments)
def generate_application_documents(payload: GenerateRequest):
    try:
        return generate_documents(
            base_cv=payload.base_cv,
            job_description=payload.job_description,
            instructions=payload.instructions,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/regenerate", response_model=GeneratedDocuments)
def regenerate_application_documents(payload: RegenerateRequest):
    try:
        return generate_documents(
            base_cv=payload.base_cv,
            job_description=payload.job_description,
            instructions=payload.instructions,
            current_cv=payload.current_cv,
            current_cover_letter=payload.current_cover_letter,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
