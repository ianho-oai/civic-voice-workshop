import { describe, expect, it } from "vitest";
import { hasFeedbackContent } from "./feedback-validation";

describe("feedback validation", () => {
  it("rejects blank and whitespace-only messages", () => {
    expect(hasFeedbackContent("")).toBe(false);
    expect(hasFeedbackContent(" \n\t ")).toBe(false);
  });

  it("accepts useful feedback", () => {
    expect(hasFeedbackContent("Please add more benches.")).toBe(true);
  });
});
