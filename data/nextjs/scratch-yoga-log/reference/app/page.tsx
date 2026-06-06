import React, { useState } from "react";

interface YogaSession {
  id: number;
  date: string;
  style: string;
  duration: number;
  notes: string;
}

const SEED_SESSIONS: YogaSession[] = [
  { id: 1, date: "2024-01-10", style: "Hatha", duration: 45, notes: "Morning flow" },
  { id: 2, date: "2024-01-12", style: "Vinyasa", duration: 60, notes: "Energizing session" },
  { id: 3, date: "2024-01-14", style: "Yin", duration: 30, notes: "Deep stretches" },
];

const STYLES = ["Hatha", "Vinyasa", "Yin", "Restorative", "Ashtanga"];

export default function App() {
  const [sessions, setSessions] = useState<YogaSession[]>(SEED_SESSIONS);
  const [nextId, setNextId] = useState(4);
  const [date, setDate] = useState("");
  const [style, setStyle] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: string[] = [];
    if (!date) errs.push("Date is required");
    if (!style) errs.push("Style is required");
    const dur = parseInt(duration, 10);
    if (!duration || isNaN(dur) || dur <= 0) errs.push("Duration must be positive");
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    const newSession: YogaSession = {
      id: nextId,
      date,
      style,
      duration: dur,
      notes,
    };
    setSessions((prev) => [...prev, newSession]);
    setNextId((n) => n + 1);
    setDate("");
    setStyle("");
    setDuration("");
    setNotes("");
    setErrors([]);
  }

  function handleDelete(id: number) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <h1>Yoga Log</h1>

      <div data-testid="total-sessions">Total sessions: {sessions.length}</div>
      <div data-testid="total-minutes">Total minutes: {totalMinutes}</div>

      {errors.length > 0 && (
        <ul data-testid="error-list">
          {errors.map((err, i) => (
            <li key={i} data-testid={`error-${i}`}>{err}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} data-testid="yoga-form">
        <div>
          <label htmlFor="date-input">Date</label>
          <input
            id="date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            data-testid="date-input"
          />
        </div>
        <div>
          <label htmlFor="style-select">Style</label>
          <select
            id="style-select"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            data-testid="style-select"
          >
            <option value="">Select style</option>
            {STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="duration-input">Duration (min)</label>
          <input
            id="duration-input"
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            data-testid="duration-input"
          />
        </div>
        <div>
          <label htmlFor="notes-input">Notes</label>
          <input
            id="notes-input"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            data-testid="notes-input"
          />
        </div>
        <button type="submit" data-testid="add-button">Add Session</button>
      </form>

      <ul data-testid="session-list">
        {sessions.map((s) => (
          <li key={s.id} data-testid={`session-${s.id}`}>
            <span data-testid={`session-date-${s.id}`}>{s.date}</span>
            <span data-testid={`session-style-${s.id}`}>{s.style}</span>
            <span data-testid={`session-duration-${s.id}`}>{s.duration} min</span>
            {s.notes && <span data-testid={`session-notes-${s.id}`}>{s.notes}</span>}
            <button
              onClick={() => handleDelete(s.id)}
              data-testid={`delete-${s.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
