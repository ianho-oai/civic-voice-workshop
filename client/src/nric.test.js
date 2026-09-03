import { describe, expect, it } from "vitest";
import { normalizeNric, validateNric } from "./nric";

describe("NRIC-like login input", () => {
  it("accepts the seeded workshop IDs", () => {
    expect(validateNric("S0000001A")).toBe("");
    expect(validateNric("S0000002B")).toBe("");
  });

  it("normalizes surrounding whitespace and letter case", () => {
    expect(normalizeNric(" s0000001a ")).toBe("S0000001A");
    expect(validateNric(" s0000001a ")).toBe("");
  });

  it("rejects malformed IDs", () => {
    expect(validateNric("")).not.toBe("");
    expect(validateNric("S00001A")).not.toBe("");
    expect(validateNric("not-an-id")).not.toBe("");
  });
});
