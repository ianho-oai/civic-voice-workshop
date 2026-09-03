import { useState } from "react";
import { submitFeedback } from "../api";
import { isFeedbackWithinLimit, MAX_FEEDBACK_LENGTH } from "../feedback";
import { hasFeedbackContent } from "../feedback-validation";

const CATEGORIES = ["Estate", "Transport", "Environment", "Other"];

export function CitizenPage({ user }) {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!hasFeedbackContent(message)) {
      setError("Please enter feedback.");
      return;
    }
    if (!isFeedbackWithinLimit(message)) {
      setError(`Feedback must be ${MAX_FEEDBACK_LENGTH} characters or fewer.`);
      return;
    }
    try {
      await submitFeedback({ nric: user.nric, name: user.name, message, category });
      setSubmitted(true);
      setMessage("");
    } catch (requestError) {
      setError(requestError.message);
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
        {submitted && <div className="success-banner">Thank you. Your feedback has been received.</div>}
        <form onSubmit={handleSubmit}>
          <label>Your feedback
            <textarea rows="7" value={message} maxLength={MAX_FEEDBACK_LENGTH} onChange={(event) => setMessage(event.target.value)} placeholder="Share your feedback here..." />
          </label>
          <label>Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {CATEGORIES.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <div className="form-footer">
            <span className="muted">Please do not include sensitive personal information.</span>
            <span className="muted">{message.length} / {MAX_FEEDBACK_LENGTH} characters</span>
            <button className="primary-button">Submit feedback</button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </section>
    </main>
  );
}
