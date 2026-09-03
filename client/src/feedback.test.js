import { describe, expect, it } from "vitest";
import { hasFeedbackContent } from "./feedback";

describe("hasFeedbackContent", () => {
  it("rejects empty and whitespace-only feedback", () => {
    expect(hasFeedbackContent("")).toBe(false);
    expect(hasFeedbackContent(" \t\n ")).toBe(false);
  });

  it("accepts feedback containing useful text", () => {
    expect(hasFeedbackContent("Please add more benches.")).toBe(true);
  });
});
