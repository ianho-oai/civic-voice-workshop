import { useEffect, useState } from "react";
import { getFeedback } from "../api";

export function AdminPage({ user }) {
  const [feedback, setFeedback] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

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
