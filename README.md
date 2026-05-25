# AI-Powered Job Application Assistant 🤖

AI-powered job application assistant — tailored CVs, cover letters, and application tracking, all in one place.

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI
- Database: MySQL with SQLAlchemy
- LLM: OpenAI API
- PDF: ReportLab

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt

```

Run the backend:

```bash
uvicorn main:app --reload
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Workflow

1. Add your master CV on the Base CV page.
2. Paste a job description on the Generate page.
3. Generate tailored documents.
4. Type revision instructions like `make it shorter` or `add Django skills`.
5. Regenerate until happy.
6. Save the application to the tracker.
7. Update status from Applied to Interview, Offer, or Rejected.
8. Export the application as a PDF.
