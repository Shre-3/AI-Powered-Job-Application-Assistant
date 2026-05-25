import { useEffect, useState } from "react";

import { api } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";

const statuses = ["Applied", "Interview", "Offer", "Rejected"];

export default function Tracker() {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  async function loadApplications() {
    try {
      const data = await api.listApplications();
      setApplications(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function handleStatusChange(applicationId, status) {
    setMessage("");
    try {
      const updated = await api.updateStatus(applicationId, status);
      setApplications((current) =>
        current.map((application) => (application.id === applicationId ? updated : application)),
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDelete(applicationId) {
    setMessage("");
    try {
      await api.deleteApplication(applicationId);
      setApplications((current) => current.filter((application) => application.id !== applicationId));
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h1>Application Tracker</h1>
          <p className="muted">Update status from Applied to Interview, Offer, or Rejected.</p>
        </div>
        <button className="button" type="button" onClick={loadApplications}>
          Refresh
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td>{application.company_name}</td>
                <td>{application.job_title}</td>
                <td>
                  <StatusBadge status={application.status} />
                  <select
                    value={application.status}
                    onChange={(event) => handleStatusChange(application.id, event.target.value)}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{new Date(application.updated_at).toLocaleDateString()}</td>
                <td className="row-actions">
                  <a className="button small" href={api.exportPdfUrl(application.id)}>
                    PDF
                  </a>
                  <button className="button small danger" type="button" onClick={() => handleDelete(application.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!applications.length && (
              <tr>
                <td colSpan="5" className="empty">
                  No applications saved yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
