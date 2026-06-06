import React, { useState } from "react";

interface MeditationSession {
  id: number;
  date: string;
  duration: number;
  type: string;
  notes: string;
}

const SEED_SESSIONS: MeditationSession[] = [
  { id: 1, date: "2024-02-01", duration: 10, type: "Mindfulness", notes: "Morning calm" },
  { id: 2, date: "2024-02-03", duration: 20, type: "Focused", notes: "Good concentration" },
  { id: 3, date: "2024-02-05", duration: 15, type: "Body Scan", notes: "Relaxing" },
];

const TYPES = ["Mindfulness", "Focused", "Body Scan", "Loving-Kindness", "Transcendental"];

export default function App() {
  const [sessions, setSessions] = useState<MeditationSession[]>(SEED_SESSIONS);
  const [nextId, setNextId] = useState(4);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const longestSession = sessions.length > 0 ? Math.max(...sessions.map((s) => s.duration)) : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: string[] = [];
    if (!date) errs.push("Date is required");
    if (!type) errs.push("Type is required");
    const dur = parseInt(duration, 10);
    if (!duration || isNaN(dur) || dur <= 0) errs.push("Duration must be positive");
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    const newSession: MeditationSession = { id: nextId, date, duration: dur, type, notes };
    setSessions((prev) => [...prev, newSession]);
    setNextId((n) => n + 1);
    setDate("");
    setDuration("");
    setType("");
    setNotes("");
    setErrors([]);
  }

  function handleDelete(id: number) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <h1>Meditation Timer</h1>

      <div data-testid="total-sessions">Total sessions: {sessions.length}</div>
      <div data-testid="total-minutes">Total minutes: {totalMinutes}</div>
      <div data-testid="longest-session">Longest session: {longestSession} min</div>

      {errors.length > 0 && (
        <ul data-testid="error-list">
          {errors.map((err, i) => (
            <li key={i} data-testid={`error-${i}`}>{err}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} data-testid="meditation-form">
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
          <label htmlFor="type-select">Type</label>
          <select
            id="type-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            data-testid="type-select"
          >
            <option value="">Select type</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
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
            <span data-testid={`session-type-${s.id}`}>{s.type}</span>
            <span data-testid={`session-duration-${s.id}`}>{s.duration} min</span>
            {s.notes && <span data-testid={`session-notes-${s.id}`}>{s.notes}</span>}
            <button onClick={() => handleDelete(s.id)} data-testid={`delete-${s.id}`}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
