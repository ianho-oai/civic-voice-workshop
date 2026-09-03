import { useState } from "react";
import { submitFeedback } from "../api";
import { hasFeedbackContent } from "../feedback";

export function CitizenPage({ user }) {
  const maximumMessageLength = 500;
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!hasFeedbackContent(message)) {
      setError("Please enter feedback that is not blank.");
      return;
    }
    try {
      await submitFeedback({ nric: user.nric, name: user.name, message, category });
      setSubmitted(true);
      setMessage("");
      setCategory("");
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
            <textarea rows="7" value={message} maxLength={maximumMessageLength} onChange={(event) => setMessage(event.target.value)} placeholder="Share your feedback here..." />
          </label>
          <p className="muted" aria-live="polite">{message.length} / {maximumMessageLength} characters</p>
          <label htmlFor="feedback-category">Category
            <select id="feedback-category" value={category} onChange={(event) => setCategory(event.target.value)} required>
              <option value="" disabled>Choose a category</option>
              <option value="Estate">Estate</option>
              <option value="Transport">Transport</option>
              <option value="Environment">Environment</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <div className="form-footer">
            <span className="muted">Please do not include sensitive personal information.</span>
            <button className="primary-button">Submit feedback</button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </section>
    </main>
  );
}
