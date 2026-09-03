import { describe, expect, it } from "vitest";
import { clearSession, persistSession, restoreSession, SESSION_STORAGE_KEY } from "./session";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

const session = {
  token: "demo-token",
  user: { nric: "S0000001A", name: "Aisha Rahman", role: "citizen" },
};

describe("session storage", () => {
  it("restores a persisted successful session", () => {
    const storage = createStorage();
    persistSession(session, storage);

    expect(restoreSession(storage)).toEqual(session);
  });

  it("clears the session on sign out", () => {
    const storage = createStorage();
    persistSession(session, storage);
    clearSession(storage);

    expect(storage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    expect(restoreSession(storage)).toBeNull();
  });

  it("ignores malformed stored data", () => {
    const storage = createStorage();
    storage.setItem(SESSION_STORAGE_KEY, "not json");

    expect(restoreSession(storage)).toBeNull();
  });
});
