const STORAGE_KEY = "civicvoice-session";

function storage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

export function loadSession() {
  try {
    const savedSession = storage()?.getItem(STORAGE_KEY);
    if (!savedSession) return null;

    const session = JSON.parse(savedSession);
    const role = session?.user?.role;
    return role === "citizen" || role === "admin" ? session : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  storage()?.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  storage()?.removeItem(STORAGE_KEY);
}
