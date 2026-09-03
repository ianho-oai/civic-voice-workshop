const SESSION_KEY = "civic-voice-session";
const ROLES = new Set(["citizen", "admin"]);

function isSession(value) {
  return Boolean(
    value
      && typeof value.token === "string"
      && value.user
      && typeof value.user.nric === "string"
      && typeof value.user.name === "string"
      && ROLES.has(value.user.role),
  );
}

export function loadSession(storage = window.localStorage) {
  const storedSession = storage.getItem(SESSION_KEY);
  if (!storedSession) return null;

  try {
    const session = JSON.parse(storedSession);
    if (isSession(session)) return session;
  } catch {
    // Treat invalid local data as a signed-out state.
  }

  storage.removeItem(SESSION_KEY);
  return null;
}

export function saveSession(session, storage = window.localStorage) {
  storage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(storage = window.localStorage) {
  storage.removeItem(SESSION_KEY);
}
