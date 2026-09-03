import { useEffect, useState } from "react";
import { getFeedback } from "../api";

function maskNric(nric) {
  if (!nric) return "";
  return `${nric.slice(0, 1)}${"•".repeat(Math.max(0, nric.length - 3))}${nric.slice(-2)}`;
}

export function AdminPage({ user }) {
  const [feedback, setFeedback] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const summary = feedback.reduce((counts, item) => {
    const status = item.status?.toLowerCase();
    counts.total += 1;
    if (status === "new") counts.new += 1;
    if (status === "in review") counts.inReview += 1;
    if (status === "closed") counts.closed += 1;
    return counts;
  }, { total: 0, new: 0, inReview: 0, closed: 0 });

  const searchTerm = search.trim().toLowerCase();
  const visibleFeedback = feedback.filter((item) => (
    !searchTerm
    || item.name.toLowerCase().includes(searchTerm)
    || item.message.toLowerCase().includes(searchTerm)
  ));

  useEffect(() => {
    getFeedback(user).then((response) => setFeedback(response.feedback)).catch((requestError) => setError(requestError.message));
  }, [user]);

  return (
    <main className="page-shell admin-shell">
      <div className="page-heading">
        <div className="eyebrow">Admin workspace</div>
        <h1>Feedback inbox</h1>
        <p>A simple view of feedback received from members of the public.</p>
      </div>
      {error && <p className="error-message">{error}</p>}
      <section className="inbox-summary" aria-label="Inbox summary">
        <article className="summary-card">
          <span className="summary-label">Total</span>
          <strong>{summary.total}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-label">New</span>
          <strong>{summary.new}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-label">In review</span>
          <strong>{summary.inReview}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-label">Closed</span>
          <strong>{summary.closed}</strong>
        </article>
      </section>
      <section className="feedback-list">
        <label>
          Search feedback
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search messages or residents"
          />
        </label>
        <div className="list-header"><strong>Latest feedback</strong><span>{visibleFeedback.length} items</span></div>
        {visibleFeedback.map((item) => (
          <article className="feedback-row" key={item.id}>
            <div>
              <div className="feedback-meta">Resident ID: {maskNric(item.nric)}</div>
              <div className="feedback-meta">{item.name} · {new Date(item.createdAt).toLocaleDateString()}</div>
              <p>{item.message}</p>
            </div>
            <span className="status-pill">{item.status}</span>
          </article>
        ))}
        {searchTerm && visibleFeedback.length === 0 && <p className="muted">No feedback matches “{search.trim()}”.</p>}
      </section>
    </main>
  );
}
