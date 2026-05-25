from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database import get_db
from models import Application
from schemas import ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate, ApplicationUpdate
from services.pdf_service import build_application_pdf

router = APIRouter(prefix="/applications", tags=["applications"])


def _get_application_or_404(application_id: int, db: Session) -> Application:
    application = db.get(Application, application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


@router.get("", response_model=list[ApplicationResponse])
def list_applications(db: Session = Depends(get_db)):
    return db.query(Application).order_by(Application.updated_at.desc()).all()


@router.post("", response_model=ApplicationResponse, status_code=201)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    application = Application(**payload.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.put("/{application_id}", response_model=ApplicationResponse)
def update_application(
    application_id: int,
    payload: ApplicationUpdate,
    db: Session = Depends(get_db),
):
    application = _get_application_or_404(application_id, db)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(application, key, value)

    db.commit()
    db.refresh(application)
    return application


@router.patch("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
):
    application = _get_application_or_404(application_id, db)
    application.status = payload.status
    db.commit()
    db.refresh(application)
    return application


@router.delete("/{application_id}", status_code=204)
def delete_application(application_id: int, db: Session = Depends(get_db)):
    application = _get_application_or_404(application_id, db)
    db.delete(application)
    db.commit()
    return None


@router.get("/{application_id}/export.pdf")
def export_application_pdf(application_id: int, db: Session = Depends(get_db)):
    application = _get_application_or_404(application_id, db)
    pdf_buffer = build_application_pdf(application)
    filename = f"{application.company_name}-{application.job_title}.pdf".replace(" ", "-")

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
