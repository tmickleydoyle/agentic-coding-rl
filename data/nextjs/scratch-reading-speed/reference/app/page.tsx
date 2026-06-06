"use client";
import { useState } from "react";

interface Session {
  id: number;
  book: string;
  pages: number;
  minutes: number;
}

const SEED_SESSIONS: Session[] = [
  { id: 1, book: "Dune", pages: 30, minutes: 45 },
  { id: 2, book: "Sapiens", pages: 20, minutes: 25 },
  { id: 3, book: "Dune", pages: 50, minutes: 60 },
];

let nextId = 4;

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(SEED_SESSIONS);
  const [book, setBook] = useState("");
  const [pages, setPages] = useState("");
  const [minutes, setMinutes] = useState("");

  function handleAdd() {
    const p = Number(pages);
    const m = Number(minutes);
    if (!book.trim() || !pages.trim() || !minutes.trim()) return;
    if (!Number.isInteger(p) || p < 1) return;
    if (!Number.isInteger(m) || m < 1) return;
    setSessions((prev) => [...prev, { id: nextId++, book: book.trim(), pages: p, minutes: m }]);
    setBook("");
    setPages("");
    setMinutes("");
  }

  function handleDelete(id: number) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  const totalPages = sessions.reduce((sum, s) => sum + s.pages, 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const avgSpeed = totalMinutes > 0 ? (totalPages / totalMinutes).toFixed(2) : "0.00";

  return (
    <main>
      <h1>Reading Speed Tracker</h1>

      <section data-testid="stats-panel">
        <span data-testid="stat-total-pages">Total Pages: {totalPages}</span>
        <span data-testid="stat-total-minutes">Total Minutes: {totalMinutes}</span>
        <span data-testid="stat-avg-speed">Average Speed: {avgSpeed} pages/min</span>
      </section>

      <section data-testid="add-form">
        <input
          data-testid="input-book"
          placeholder="Book"
          value={book}
          onChange={(e) => setBook(e.target.value)}
          aria-label="Book"
        />
        <input
          data-testid="input-pages"
          placeholder="Pages Read"
          type="number"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          aria-label="Pages Read"
        />
        <input
          data-testid="input-minutes"
          placeholder="Minutes Spent"
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          aria-label="Minutes Spent"
        />
        <button data-testid="btn-add" onClick={handleAdd}>Add Session</button>
      </section>

      <ul data-testid="session-list">
        {sessions.map((s) => (
          <li key={s.id} data-testid={`session-card-${s.id}`}>
            <span data-testid={`session-book-${s.id}`}>{s.book}</span>
            <span data-testid={`session-pages-${s.id}`}>{s.pages}</span>
            <span data-testid={`session-minutes-${s.id}`}>{s.minutes}</span>
            <span data-testid={`session-speed-${s.id}`}>{(s.pages / s.minutes).toFixed(2)} pages/min</span>
            <button data-testid={`btn-delete-${s.id}`} onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
