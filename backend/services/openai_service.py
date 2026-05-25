import json
import os

from openai import OpenAI


SYSTEM_PROMPT = """
You are an expert career assistant. Generate honest, recruiter-friendly application
materials that tailor the user's existing experience to the provided job description.
Do not invent employers, degrees, dates, certifications, or projects that are not in
the base CV. Return only valid JSON with keys "tailored_cv" and "cover_letter".
"""


def _client() -> OpenAI:
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY is missing. Add it to backend/.env.")

    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_documents(
    *,
    base_cv: str,
    job_description: str,
    instructions: str | None = None,
    current_cv: str | None = None,
    current_cover_letter: str | None = None,
) -> dict[str, str]:
    user_prompt = {
        "base_cv": base_cv,
        "job_description": job_description,
        "instructions": instructions or "Tailor the CV and write a concise compelling cover letter.",
        "current_cv": current_cv,
        "current_cover_letter": current_cover_letter,
    }

    response = _client().chat.completions.create(
        model=os.getenv("OPENAI_MODEL"),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT.strip()},
            {
                "role": "user",
                "content": (
                    "Create or revise the application materials using this JSON input:\n"
                    f"{json.dumps(user_prompt, ensure_ascii=False)}"
                ),
            },
        ],
        response_format={"type": "json_object"},
        temperature=0.4,
    )

    content = response.choices[0].message.content or "{}"
    data = json.loads(content)

    tailored_cv = data.get("tailored_cv", "").strip()
    cover_letter = data.get("cover_letter", "").strip()
    if not tailored_cv or not cover_letter:
        raise RuntimeError("OpenAI response did not include tailored_cv and cover_letter.")

    return {"tailored_cv": tailored_cv, "cover_letter": cover_letter}
