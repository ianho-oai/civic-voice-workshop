import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { createDb } from "./lib/db.js";

async function testApp() {
  const directory = await mkdtemp(path.join(os.tmpdir(), "civic-voice-"));
  const db = await createDb(path.join(directory, "db.json"));
  return createApp({ db });
}

describe("CivicVoice baseline API", () => {
  it("creates a missing datastore directory on first use", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "civic-voice-"));
    const db = await createDb(path.join(directory, "missing", "data", "db.json"));
    expect(db.data.users).toHaveLength(2);
  });

  it("logs in the seeded citizen", async () => {
    const app = await testApp();
    const response = await request(app).post("/api/login").send({
      nric: "S0000001A", password: "citizen123", role: "citizen",
    });
    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe("citizen");
  });

  it("stores hashed demo passwords while keeping the workshop credentials usable", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "civic-voice-"));
    const db = await createDb(path.join(directory, "db.json"));
    expect(db.data.users.every((user) => !Object.hasOwn(user, "password"))).toBe(true);
    expect(db.data.users.every((user) => /^[a-f0-9]{128}$/.test(user.passwordHash))).toBe(true);

    const app = await createApp({ db });
    const response = await request(app).post("/api/login").send({
      nric: "S0000002B", password: "admin123", role: "admin",
    });
    expect(response.status).toBe(200);
  });

  it("accepts feedback", async () => {
    const app = await testApp();
    const response = await request(app).post("/api/feedback").send({
      nric: "S0000001A", name: "Aisha Rahman", message: "Please add more benches.",
    });
    expect(response.status).toBe(201);
    expect(response.body.feedback.message).toBe("Please add more benches.");
  });

  it("rejects blank or whitespace-only feedback", async () => {
    const app = await testApp();

    for (const message of ["", "   ", "\n\t "]) {
      const response = await request(app).post("/api/feedback").send({
        nric: "S0000001A", name: "Aisha Rahman", message,
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/not blank/i);
    }
  });

  it("blocks the feedback list without the admin role header", async () => {
    const app = await testApp();
    const response = await request(app).get("/api/feedback");
    expect(response.status).toBe(403);
  });

  it("does not trust a forged admin role header", async () => {
    const app = await testApp();
    const response = await request(app).get("/api/feedback").set("x-user-role", "admin");
    expect(response.status).toBe(403);
  });

  it("allows the inbox only with an opaque admin session token", async () => {
    const app = await testApp();
    const login = await request(app).post("/api/login").send({
      nric: "S0000002B", password: "admin123", role: "admin",
    });
    const response = await request(app)
      .get("/api/feedback")
      .set("authorization", `Bearer ${login.body.token}`);
    expect(login.body.token).not.toContain("S0000002B");
    expect(response.status).toBe(200);
  });

  it("does not allow a citizen session to access the inbox", async () => {
    const app = await testApp();
    const login = await request(app).post("/api/login").send({
      nric: "S0000001A", password: "citizen123", role: "citizen",
    });
    const response = await request(app)
      .get("/api/feedback")
      .set("authorization", `Bearer ${login.body.token}`);
    expect(response.status).toBe(403);
  });
});
