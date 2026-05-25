const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let detail = "Request failed";
    try {
      const error = await response.json();
      detail = error.detail || detail;
    } catch {
      detail = response.statusText || detail;
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getBaseCv: () => request("/cv/base"),
  saveBaseCv: (content) =>
    request("/cv/base", {
      method: "PUT",
      body: JSON.stringify({ content }),
    }),
  generate: (payload) =>
    request("/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  regenerate: (payload) =>
    request("/generate/regenerate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listApplications: () => request("/applications"),
  createApplication: (payload) =>
    request("/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateStatus: (id, status) =>
    request(`/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteApplication: (id) =>
    request(`/applications/${id}`, {
      method: "DELETE",
    }),
  exportPdfUrl: (id) => `${API_URL}/applications/${id}/export.pdf`,
};
