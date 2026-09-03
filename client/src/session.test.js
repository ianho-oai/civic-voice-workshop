import { describe, expect, it } from "vitest";
import { clearSession, loadSession, saveSession } from "./session";

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

describe("local session storage", () => {
  it("restores a saved session", () => {
    const storage = createStorage();
    saveSession(session, storage);

    expect(loadSession(storage)).toEqual(session);
  });

  it("clears a session on sign out", () => {
    const storage = createStorage();
    saveSession(session, storage);
    clearSession(storage);

    expect(loadSession(storage)).toBeNull();
  });

  it("removes malformed persisted data", () => {
    const storage = createStorage();
    storage.setItem("civic-voice-session", "not json");

    expect(loadSession(storage)).toBeNull();
    expect(storage.getItem("civic-voice-session")).toBeNull();
  });
});
