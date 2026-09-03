import { useState } from "react";
import { submitFeedback } from "../api";

export function CitizenPage({ user }) {
  const maxMessageLength = 500;
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (message.length > maxMessageLength) {
      setError(`Feedback must be ${maxMessageLength} characters or fewer.`);
      return;
    }
    try {
      await submitFeedback({ nric: user.nric, name: user.name, message });
      setSubmitted(true);
      setMessage("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function handleSubmitAnother() {
    setSubmitted(false);
    setError("");
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
          <div className="submission-success" role="status">
            <div className="success-banner">Thank you. Your feedback has been received.</div>
            <p>You can send another piece of feedback whenever you are ready.</p>
            <button className="primary-button" type="button" onClick={handleSubmitAnother}>
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Your feedback
              <textarea
                rows="7"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={maxMessageLength}
                placeholder="Share your feedback here..."
              />
            </label>
            <div className="form-footer">
              <div>
                <div className="muted" aria-live="polite">{message.length} / {maxMessageLength} characters</div>
                <span className="muted">Please do not include sensitive personal information.</span>
              </div>
              <button className="primary-button">Submit feedback</button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </form>
        )}
      </section>
    </main>
  );
}
