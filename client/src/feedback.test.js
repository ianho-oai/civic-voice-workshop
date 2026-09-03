import { describe, expect, it } from "vitest";
import { getInboxSummary, hasFeedbackContent } from "./feedback";

describe("hasFeedbackContent", () => {
  it("rejects empty and whitespace-only feedback", () => {
    expect(hasFeedbackContent("")).toBe(false);
    expect(hasFeedbackContent(" \t\n ")).toBe(false);
  });

  it("accepts feedback containing useful text", () => {
    expect(hasFeedbackContent("Please add more benches.")).toBe(true);
  });
});

describe("getInboxSummary", () => {
  it("counts each inbox status from the loaded feedback", () => {
    expect(getInboxSummary([
      { status: "New" },
      { status: "New" },
      { status: "In review" },
      { status: "Closed" },
    ])).toEqual({ total: 4, new: 2, inReview: 1, closed: 1 });
  });

  it("returns zeroes for an empty inbox", () => {
    expect(getInboxSummary([])).toEqual({ total: 0, new: 0, inReview: 0, closed: 0 });
  });
});
