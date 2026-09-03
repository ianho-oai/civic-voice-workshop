import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import { createDb } from "./lib/db.js";

const feedbackCategories = ["Estate", "Transport", "Environment", "Other"];

function passwordMatches(password, passwordHash) {
  if (typeof password !== "string" || typeof passwordHash !== "string") return false;
  const derivedHash = crypto.scryptSync(password, "civic-voice-demo-password-salt", 64);
  const storedHash = Buffer.from(passwordHash, "hex");
  return storedHash.length === derivedHash.length && crypto.timingSafeEqual(storedHash, derivedHash);
}

export async function createApp(options = {}) {
  const db = options.db ?? (await createDb());
  const sessions = new Map();
  const failedLogins = new Map();
  const maxFailedLogins = options.maxFailedLogins ?? 5;
  const loginWindowMs = options.loginWindowMs ?? 60_000;
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "civic-voice-api" });
  });

  app.post("/api/login", (req, res) => {
    const { nric, password, role } = req.body ?? {};
    const attemptKey = `${req.ip}:${nric ?? "unknown"}`;
    const now = Date.now();
    const attempts = failedLogins.get(attemptKey)?.filter((attempt) => now - attempt < loginWindowMs) ?? [];
    if (attempts.length >= maxFailedLogins) {
      const retryAfterSeconds = Math.max(1, Math.ceil((loginWindowMs - (now - attempts[0])) / 1000));
      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({ error: `Too many sign-in attempts. Try again in ${retryAfterSeconds} seconds.` });
    }
    const user = db.data.users.find(
      (candidate) => candidate.nric === nric && candidate.role === role,
    );
    if (!user || !passwordMatches(password, user.passwordHash)) {
      failedLogins.set(attemptKey, [...attempts, now]);
      return res.status(401).json({ error: "Invalid NRIC, password, or sign-in mode." });
    }

    failedLogins.delete(attemptKey);
    const token = crypto.randomUUID();
    sessions.set(token, { nric: user.nric, role: user.role });
    return res.json({ token, user: { nric: user.nric, name: user.name, role: user.role } });
  });

  function requireAdmin(req, res, next) {
    const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
    const session = token && sessions.get(token);
    if (session?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required." });
    }
    req.session = session;
    return next();
  }

  app.get("/api/feedback", requireAdmin, (_req, res) => {
    const feedback = [...db.data.feedback].sort(
      (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
    );
    return res.json({ feedback });
  });

  app.post("/api/feedback", async (req, res) => {
    const { nric, name, message, category } = req.body ?? {};
    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Please enter feedback that is not blank." });
    }
    if (!feedbackCategories.includes(category)) {
      return res.status(400).json({ error: "Please select a valid feedback category." });
    }
    const feedback = {
      id: crypto.randomUUID(), nric, name, message, category, status: "New",
      createdAt: new Date().toISOString(),
    };
    db.data.feedback.unshift(feedback);
    await db.write();
    return res.status(201).json({ feedback });
  });

  return app;
}
