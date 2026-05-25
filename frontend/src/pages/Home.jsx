import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <p className="eyebrow">AI-powered job applications</p>
      <h1>Generate, refine, save, track, and export every application.</h1>
      <p>A product by Shreya Acharya.</p>
      <div className="actions">
        <Link className="button primary" to="/base-cv">
          Add Base CV
        </Link>
        <Link className="button" to="/generate">
          Paste JD
        </Link>
      </div>
      <p>What to do next:</p>
      <div className="workflow">
        <span>Save your Base CV</span>
        <span>Paste the job Description</span>
        <span>AI tailors your CV</span>
        <span>Save the application</span>
        <span>Track it + Export as PDF</span>
      </div>
    </section>
  );
}
