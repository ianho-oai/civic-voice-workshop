import { describe, expect, it } from "vitest";
import { isFeedbackWithinLimit, MAX_FEEDBACK_LENGTH } from "./feedback";

describe("feedback character limit", () => {
  it("allows feedback up to 500 characters", () => {
    expect(isFeedbackWithinLimit("a".repeat(MAX_FEEDBACK_LENGTH))).toBe(true);
  });

  it("rejects feedback over 500 characters", () => {
    expect(isFeedbackWithinLimit("a".repeat(MAX_FEEDBACK_LENGTH + 1))).toBe(false);
  });
});
