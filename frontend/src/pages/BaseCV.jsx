import { useEffect, useState } from "react";

import { api } from "../api.js";
import CVEditor from "../components/CVEditor.jsx";

export default function BaseCV() {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .getBaseCv()
      .then((data) => setContent(data.content || ""))
      .catch((error) => setMessage(error.message));
  }, []);

  async function handleSave(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.saveBaseCv(content);
      setMessage("Base CV saved.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h1>Base CV</h1>
      <p className="muted">
        Store your master CV here. The generator uses it as the source of truth
        when tailoring applications.
      </p>
      <form onSubmit={handleSave}>
        <CVEditor
          label="Master CV"
          value={content}
          onChange={setContent}
          placeholder="Paste your full CV, skills, projects, education, and work experience..."
        />
        <button className="button primary" disabled={loading || !content.trim()}>
          {loading ? "Saving..." : "Save Base CV"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </section>
  );
}
