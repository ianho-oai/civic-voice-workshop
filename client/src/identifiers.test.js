import { describe, expect, it } from "vitest";
import { maskIdentifier } from "./identifiers";

describe("maskIdentifier", () => {
  it("keeps only the first and last two characters of an NRIC-like ID", () => {
    expect(maskIdentifier("S0000001A")).toBe("S••••••1A");
  });

  it("does not return malformed or short identifiers unchanged", () => {
    expect(maskIdentifier("")).toBe("");
    expect(maskIdentifier("AB")).toBe("••");
    expect(maskIdentifier(null)).toBe("");
  });
});
