from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

ApplicationStatus = Literal["Applied", "Interview", "Offer", "Rejected"]


class BaseCVUpsert(BaseModel):
    content: str = Field(..., min_length=1)


class BaseCVResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    content: str
    created_at: datetime | None = None
    updated_at: datetime | None = None


class GenerateRequest(BaseModel):
    base_cv: str = Field(..., min_length=1)
    job_description: str = Field(..., min_length=1)
    instructions: str | None = None


class RegenerateRequest(GenerateRequest):
    current_cv: str = Field(..., min_length=1)
    current_cover_letter: str = Field(..., min_length=1)


class GeneratedDocuments(BaseModel):
    tailored_cv: str
    cover_letter: str


class ApplicationCreate(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=255)
    job_title: str = Field(..., min_length=1, max_length=255)
    job_description: str = Field(..., min_length=1)
    tailored_cv: str = Field(..., min_length=1)
    cover_letter: str = Field(..., min_length=1)
    status: ApplicationStatus = "Applied"


class ApplicationUpdate(BaseModel):
    company_name: str | None = Field(default=None, min_length=1, max_length=255)
    job_title: str | None = Field(default=None, min_length=1, max_length=255)
    job_description: str | None = Field(default=None, min_length=1)
    tailored_cv: str | None = Field(default=None, min_length=1)
    cover_letter: str | None = Field(default=None, min_length=1)
    status: ApplicationStatus | None = None


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_name: str
    job_title: str
    job_description: str
    tailored_cv: str
    cover_letter: str
    status: str
    created_at: datetime
    updated_at: datetime
