import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearSession, loadSession, saveSession } from "./session";

const session = { user: { name: "Aisha Rahman", role: "citizen" } };

let savedValues;

beforeEach(() => {
  savedValues = new Map();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (key) => savedValues.get(key) ?? null,
      setItem: (key, value) => savedValues.set(key, value),
      removeItem: (key) => savedValues.delete(key),
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("saved sessions", () => {
  it("restores a successful session after a page load", () => {
    saveSession(session);

    expect(loadSession()).toEqual(session);
  });

  it("clears a saved session on sign out", () => {
    saveSession(session);
    clearSession();

    expect(loadSession()).toBeNull();
  });

  it("ignores malformed or unsupported saved sessions", () => {
    window.localStorage.setItem("civicvoice-session", "not-json");
    expect(loadSession()).toBeNull();

    window.localStorage.setItem("civicvoice-session", JSON.stringify({ user: { role: "unknown" } }));
    expect(loadSession()).toBeNull();
  });
});
