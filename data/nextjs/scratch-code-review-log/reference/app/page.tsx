import React, { useState } from "react";

type Status = "approved" | "rejected" | "pending";

interface Review {
  id: number;
  reviewer: string;
  pr_title: string;
  status: Status;
  comments: number;
  date: string;
}

const SEED: Review[] = [
  { id: 1, reviewer: "alice", pr_title: "Add user authentication", status: "approved", comments: 3, date: "2024-01-10" },
  { id: 2, reviewer: "bob", pr_title: "Fix null pointer exception", status: "rejected", comments: 7, date: "2024-01-11" },
  { id: 3, reviewer: "carol", pr_title: "Refactor database layer", status: "pending", comments: 2, date: "2024-01-12" },
  { id: 4, reviewer: "alice", pr_title: "Add caching middleware", status: "approved", comments: 1, date: "2024-01-13" },
  { id: 5, reviewer: "dave", pr_title: "Update API endpoints", status: "pending", comments: 4, date: "2024-01-14" },
];

const STATUS_COLORS: Record<Status, string> = {
  approved: "#22c55e",
  rejected: "#ef4444",
  pending: "#eab308",
};

type FilterType = "all" | Status;

export default function App() {
  const [reviews, setReviews] = useState<Review[]>(SEED);
  const [filter, setFilter] = useState<FilterType>("all");
  const [nextId, setNextId] = useState(6);

  const [reviewer, setReviewer] = useState("");
  const [prTitle, setPrTitle] = useState("");
  const [status, setStatus] = useState<Status>("pending");
  const [comments, setComments] = useState(0);
  const [date, setDate] = useState("");

  const handleAdd = () => {
    if (!reviewer.trim() || !prTitle.trim()) return;
    const newReview: Review = {
      id: nextId,
      reviewer: reviewer.trim(),
      pr_title: prTitle.trim(),
      status,
      comments: comments || 0,
      date,
    };
    setReviews((prev) => [...prev, newReview]);
    setNextId((n) => n + 1);
    setReviewer("");
    setPrTitle("");
    setStatus("pending");
    setComments(0);
    setDate("");
  };

  const handleDelete = (id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  const total = reviews.length;
  const approved = reviews.filter((r) => r.status === "approved").length;
  const avgComments = total === 0 ? "0.0" : (reviews.reduce((sum, r) => sum + r.comments, 0) / total).toFixed(1);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Code Review Log</h1>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <span data-testid="stat-total">Total: {total}</span>
        <span data-testid="stat-approved">Approved: {approved}</span>
        <span data-testid="stat-avg-comments">Avg Comments: {avgComments}</span>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button data-testid="filter-all" onClick={() => setFilter("all")}>All</button>
        <button data-testid="filter-approved" onClick={() => setFilter("approved")}>Approved</button>
        <button data-testid="filter-rejected" onClick={() => setFilter("rejected")}>Rejected</button>
        <button data-testid="filter-pending" onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          data-testid="input-reviewer"
          placeholder="Reviewer"
          value={reviewer}
          onChange={(e) => setReviewer(e.target.value)}
        />
        <input
          data-testid="input-pr-title"
          placeholder="PR Title"
          value={prTitle}
          onChange={(e) => setPrTitle(e.target.value)}
        />
        <select
          data-testid="select-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
          <option value="pending">pending</option>
        </select>
        <input
          data-testid="input-comments"
          type="number"
          value={comments}
          onChange={(e) => setComments(Number(e.target.value))}
        />
        <input
          data-testid="input-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button data-testid="btn-add-review" onClick={handleAdd}>Add Review</button>
      </div>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Reviewer</th>
            <th>PR Title</th>
            <th>Status</th>
            <th>Comments</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} data-testid={`review-row-${r.id}`}>
              <td>{r.reviewer}</td>
              <td>{r.pr_title}</td>
              <td>
                <span
                  data-testid={`status-badge-${r.id}`}
                  style={{
                    background: STATUS_COLORS[r.status],
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {r.status}
                </span>
              </td>
              <td data-testid={`comments-${r.id}`}>{r.comments}</td>
              <td>{r.date}</td>
              <td>
                <button data-testid={`btn-delete-${r.id}`} onClick={() => handleDelete(r.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
