import { useEffect, useState } from "react";

import { api } from "../api.js";
import CVEditor from "../components/CVEditor.jsx";

const emptyResult = {
  tailored_cv: "",
  cover_letter: "",
};

export default function Generate() {
  const [baseCv, setBaseCv] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [result, setResult] = useState(emptyResult);
  const [savedApplication, setSavedApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .getBaseCv()
      .then((data) => setBaseCv(data.content || ""))
      .catch((error) => setMessage(error.message));
  }, []);

  async function handleGenerate(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSavedApplication(null);

    try {
      const data = await api.generate({
        base_cv: baseCv,
        job_description: jobDescription,
        instructions,
      });
      setResult(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate() {
    setLoading(true);
    setMessage("");
    setSavedApplication(null);

    try {
      const data = await api.regenerate({
        base_cv: baseCv,
        job_description: jobDescription,
        instructions,
        current_cv: result.tailored_cv,
        current_cover_letter: result.cover_letter,
      });
      setResult(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setLoading(true);
    setMessage("");

    try {
      const data = await api.createApplication({
        company_name: companyName,
        job_title: jobTitle,
        job_description: jobDescription,
        tailored_cv: result.tailored_cv,
        cover_letter: result.cover_letter,
        status: "Applied",
      });
      setSavedApplication(data);
      setMessage("Application saved to tracker.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const canGenerate = baseCv.trim() && jobDescription.trim();
  const canSave =
    companyName.trim() &&
    jobTitle.trim() &&
    jobDescription.trim() &&
    result.tailored_cv.trim() &&
    result.cover_letter.trim();

  return (
    <section className="grid two-column">
      <form className="card" onSubmit={handleGenerate}>
        <h1>Generate Application</h1>
        <div className="split">
          <label className="field">
            <span>Company</span>
            <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
          </label>
          <label className="field">
            <span>Job title</span>
            <input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} />
          </label>
        </div>
        <CVEditor
          label="Base CV"
          value={baseCv}
          onChange={setBaseCv}
          placeholder="Your master CV appears here after saving it on Base CV page."
        />
        <CVEditor
          label="Job description"
          value={jobDescription}
          onChange={setJobDescription}
          placeholder="Paste the job description here..."
        />
        <label className="field">
          <span>Revision instructions</span>
          <input
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            placeholder="Example: make it shorter / add Django skills"
          />
        </label>
        <div className="actions">
          <button className="button primary" disabled={loading || !canGenerate}>
            {loading ? "Working..." : "Generate"}
          </button>
          <button
            className="button"
            type="button"
            disabled={loading || !result.tailored_cv}
            onClick={handleRegenerate}
          >
            Regenerate
          </button>
        </div>
        {message && <p className="message">{message}</p>}
      </form>

      <section className="card">
        <h2>Generated Documents</h2>
        <CVEditor
          label="Tailored CV"
          value={result.tailored_cv}
          onChange={(value) => setResult((current) => ({ ...current, tailored_cv: value }))}
          placeholder="Generated CV will appear here..."
        />
        <CVEditor
          label="Cover letter"
          value={result.cover_letter}
          onChange={(value) => setResult((current) => ({ ...current, cover_letter: value }))}
          placeholder="Generated cover letter will appear here..."
        />
        <div className="actions">
          <button className="button primary" type="button" disabled={loading || !canSave} onClick={handleSave}>
            Save Application
          </button>
          {savedApplication && (
            <a className="button" href={api.exportPdfUrl(savedApplication.id)}>
              Export PDF
            </a>
          )}
        </div>
      </section>
    </section>
  );
}
