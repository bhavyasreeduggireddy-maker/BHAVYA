const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Could not reach the backend. Check your connection and the backend URL.');
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.error || body.message || `Request failed (${response.status})`;
    throw new Error(`${message} · HTTP ${response.status}`);
  }
  return body;
}

export const api = {
  baseUrl: API_BASE_URL,
  health: () => request('/health'),
  events: () => request('/api/events'),
  event: (eventId) => request(`/api/events/${encodeURIComponent(eventId)}`),
  registrations: (userId) => request(`/api/me/registrations?user_id=${encodeURIComponent(userId)}`),
  register: (userId, eventId) => request('/api/registrations', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, event_id: eventId }),
  }),
  attendees: (eventId) => request(`/api/events/${encodeURIComponent(eventId)}/registrations`),
};
