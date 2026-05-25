from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import BaseCV
from schemas import BaseCVResponse, BaseCVUpsert

router = APIRouter(prefix="/cv", tags=["cv"])


@router.get("/base", response_model=BaseCVResponse)
def get_base_cv(db: Session = Depends(get_db)):
    base_cv = db.get(BaseCV, 1)
    if base_cv:
        return base_cv

    return BaseCVResponse(id=1, content="")


@router.put("/base", response_model=BaseCVResponse)
def upsert_base_cv(payload: BaseCVUpsert, db: Session = Depends(get_db)):
    base_cv = db.get(BaseCV, 1)
    if base_cv is None:
        base_cv = BaseCV(id=1, content=payload.content)
        db.add(base_cv)
    else:
        base_cv.content = payload.content

    db.commit()
    db.refresh(base_cv)
    return base_cv
