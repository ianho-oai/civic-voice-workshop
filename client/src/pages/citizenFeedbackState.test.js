import { describe, expect, it } from "vitest";
import { feedbackReducer, initialFeedbackState } from "./citizenFeedbackState";

describe("citizen feedback submission state", () => {
  it("returns from confirmation to a fresh form for another submission", () => {
    const submitted = feedbackReducer(
      feedbackReducer(initialFeedbackState, { type: "messageChanged", message: "A fictional community note." }),
      { type: "submissionSucceeded" },
    );

    expect(submitted).toMatchObject({ submitted: true, message: "", error: "" });
    expect(feedbackReducer(submitted, { type: "startAnother" })).toMatchObject({ submitted: false, message: "", error: "" });
  });
});
