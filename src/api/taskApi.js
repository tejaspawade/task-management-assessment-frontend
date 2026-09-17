const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export async function fetchColumns() {
  const res = await fetch(`${API_BASE}/columns`);
  return handleResponse(res);
}

export async function createColumn(name) {
  const res = await fetch(`${API_BASE}/columns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return handleResponse(res);
}

export async function fetchTasksForColumn(columnId) {
  const res = await fetch(`${API_BASE}/tasks?columnId=${columnId}`);
  return handleResponse(res);
}

export async function createTask({ name, description, deadline, columnId }) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description, deadline, columnId }),
  });
  return handleResponse(res);
}

export async function updateTask(id, task) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

export async function moveTask(id, columnId) {
  const res = await fetch(`${API_BASE}/tasks/${id}/move`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ columnId }),
  });
  return handleResponse(res);
}

export async function toggleFavorite(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}/favorite`, {
    method: "PATCH",
  });
  return handleResponse(res);
}
