from html import escape
from io import BytesIO

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


def _paragraph(text: str, style):
    safe_text = escape(text).replace("\n", "<br/>")
    return Paragraph(safe_text, style)


def build_application_pdf(application) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=LETTER, title=f"{application.company_name} Application")
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph(f"{application.job_title} at {application.company_name}", styles["Title"]))
    story.append(Paragraph(f"Status: {application.status}", styles["Normal"]))
    story.append(Spacer(1, 18))

    story.append(Paragraph("Tailored CV", styles["Heading2"]))
    story.append(_paragraph(application.tailored_cv, styles["BodyText"]))
    story.append(Spacer(1, 18))

    story.append(Paragraph("Cover Letter", styles["Heading2"]))
    story.append(_paragraph(application.cover_letter, styles["BodyText"]))

    doc.build(story)
    buffer.seek(0)
    return buffer
