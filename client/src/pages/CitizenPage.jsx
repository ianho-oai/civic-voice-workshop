import { useReducer } from "react";
import { submitFeedback } from "../api";
import { feedbackReducer, initialFeedbackState } from "./citizenFeedbackState";

export function CitizenPage({ user }) {
  const [state, dispatch] = useReducer(feedbackReducer, initialFeedbackState);
  const { error, message, submitted } = state;

  async function handleSubmit(event) {
    event.preventDefault();
    dispatch({ type: "submissionFailed", error: "" });
    try {
      await submitFeedback({ nric: user.nric, name: user.name, message });
      dispatch({ type: "submissionSucceeded" });
    } catch (requestError) {
      dispatch({ type: "submissionFailed", error: requestError.message });
    }
  }

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div className="eyebrow">Public feedback</div>
        <h1>What would you like us to know?</h1>
        <p>Tell us about an issue, an idea, or a positive experience in your community.</p>
      </div>
      <section className="form-card">
        {submitted ? (
          <div className="confirmation-panel">
            <div className="success-banner">Thank you. Your feedback has been received.</div>
            <p className="muted">You can share another issue, idea, or positive experience.</p>
            <button className="primary-button" type="button" onClick={() => dispatch({ type: "startAnother" })}>
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Your feedback
              <textarea rows="7" value={message} onChange={(event) => dispatch({ type: "messageChanged", message: event.target.value })} placeholder="Share your feedback here..." />
            </label>
            <div className="form-footer">
              <span className="muted">Please do not include sensitive personal information.</span>
              <button className="primary-button">Submit feedback</button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </form>
        )}
      </section>
    </main>
  );
}
