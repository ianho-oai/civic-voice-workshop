export const SESSION_STORAGE_KEY = "civic-voice.session";

function isSession(value) {
  return Boolean(
    value
    && typeof value.token === "string"
    && value.token
    && value.user
    && typeof value.user.nric === "string"
    && typeof value.user.name === "string"
    && ["citizen", "admin"].includes(value.user.role),
  );
}

export function restoreSession(storage = globalThis.localStorage) {
  try {
    const storedSession = storage.getItem(SESSION_STORAGE_KEY);
    if (!storedSession) return null;

    const session = JSON.parse(storedSession);
    return isSession(session) ? session : null;
  } catch {
    return null;
  }
}

export function persistSession(session, storage = globalThis.localStorage) {
  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(storage = globalThis.localStorage) {
  storage.removeItem(SESSION_STORAGE_KEY);
}
