import React, { useState } from "react";

interface Session {
  id: number;
  mentor: string;
  date: string;
  topic: string;
  rating: number;
  actionItems: string;
}

const SEED: Session[] = [
  { id: 1, mentor: "Dr. Smith", date: "2024-01-05", topic: "Career Planning", rating: 5, actionItems: "Update resume, reach out to 3 companies" },
  { id: 2, mentor: "Prof. Lee", date: "2024-01-12", topic: "Research Methods", rating: 4, actionItems: "Read 2 papers, draft outline" },
  { id: 3, mentor: "Sarah Chen", date: "2024-01-19", topic: "Networking Tips", rating: 3, actionItems: "Attend club fair, LinkedIn update" },
];

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(SEED);
  const [mentor, setMentor] = useState("");
  const [date, setDate] = useState("");
  const [topic, setTopic] = useState("");
  const [rating, setRating] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [error, setError] = useState("");
  const [nextId, setNextId] = useState(4);
  const [sortMode, setSortMode] = useState<"none" | "date" | "rating">("none");

  const handleAdd = () => {
    const r = Number(rating);
    if (!mentor.trim() || !topic.trim()) {
      setError("Mentor and topic are required.");
      return;
    }
    if (!rating || r < 1 || r > 5 || !Number.isInteger(r)) {
      setError("Rating must be a whole number between 1 and 5.");
      return;
    }
    setError("");
    setSessions((prev) => [
      ...prev,
      { id: nextId, mentor: mentor.trim(), date, topic: topic.trim(), rating: r, actionItems },
    ]);
    setNextId((n) => n + 1);
    setMentor("");
    setDate("");
    setTopic("");
    setRating("");
    setActionItems("");
  };

  const handleDelete = (id: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const sorted = [...sessions].sort((a, b) => {
    if (sortMode === "date") return a.date.localeCompare(b.date);
    if (sortMode === "rating") return b.rating - a.rating;
    return 0;
  });

  const avgRating =
    sessions.length === 0
      ? "0.0"
      : (sessions.reduce((sum, s) => sum + s.rating, 0) / sessions.length).toFixed(1);

  return (
    <div>
      <h1>Mentor Log</h1>

      <div>
        <span data-testid="avg-rating">Average Rating: {avgRating}</span>
      </div>

      <div>
        <label>
          Mentor
          <input data-testid="input-mentor" value={mentor} onChange={(e) => setMentor(e.target.value)} />
        </label>
        <label>
          Date
          <input type="date" data-testid="input-date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          Topic
          <input data-testid="input-topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </label>
        <label>
          Rating (1-5)
          <input type="number" data-testid="input-rating" value={rating} onChange={(e) => setRating(e.target.value)} />
        </label>
        <label>
          Action Items
          <textarea data-testid="input-action-items" value={actionItems} onChange={(e) => setActionItems(e.target.value)} />
        </label>
        <button data-testid="btn-add" onClick={handleAdd}>Add Session</button>
        {error && <div data-testid="error-message">{error}</div>}
      </div>

      <div>
        <button data-testid="sort-date" onClick={() => setSortMode("date")}>Sort by Date</button>
        <button data-testid="sort-rating" onClick={() => setSortMode("rating")}>Sort by Rating</button>
      </div>

      <div>
        {sorted.map((s) => (
          <div key={s.id} data-testid="session-item">
            <span data-testid="session-mentor">{s.mentor}</span>
            <span data-testid="session-date">{s.date}</span>
            <span data-testid="session-topic">{s.topic}</span>
            <span data-testid="session-rating">{s.rating}</span>
            <span data-testid="session-actions">{s.actionItems}</span>
            <button data-testid="btn-delete" onClick={() => handleDelete(s.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
