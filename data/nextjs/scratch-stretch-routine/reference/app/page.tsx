import React, { useState } from "react";

interface StretchSession {
  id: number;
  date: string;
  focusArea: string;
  duration: number;
  stretches: number;
  notes: string;
}

const SEED_SESSIONS: StretchSession[] = [
  { id: 1, date: "2024-04-01", focusArea: "Hamstrings", duration: 20, stretches: 6, notes: "Post-run" },
  { id: 2, date: "2024-04-03", focusArea: "Shoulders", duration: 15, stretches: 5, notes: "Desk relief" },
  { id: 3, date: "2024-04-05", focusArea: "Full Body", duration: 30, stretches: 10, notes: "Morning routine" },
];

const FOCUS_AREAS = ["Hamstrings", "Shoulders", "Full Body", "Hip Flexors", "Back", "Calves"];

export default function App() {
  const [sessions, setSessions] = useState<StretchSession[]>(SEED_SESSIONS);
  const [nextId, setNextId] = useState(4);
  const [date, setDate] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [duration, setDuration] = useState("");
  const [stretches, setStretches] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalStretches = sessions.reduce((sum, s) => sum + s.stretches, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: string[] = [];
    if (!date) errs.push("Date is required");
    if (!focusArea) errs.push("Focus Area is required");
    const dur = parseInt(duration, 10);
    if (!duration || isNaN(dur) || dur <= 0) errs.push("Duration must be positive");
    const str = parseInt(stretches, 10);
    if (!stretches || isNaN(str) || str <= 0) errs.push("Stretches must be positive");
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    const newSession: StretchSession = { id: nextId, date, focusArea, duration: dur, stretches: str, notes };
    setSessions((prev) => [...prev, newSession]);
    setNextId((n) => n + 1);
    setDate("");
    setFocusArea("");
    setDuration("");
    setStretches("");
    setNotes("");
    setErrors([]);
  }

  function handleDelete(id: number) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <h1>Stretch Routine Log</h1>

      <div data-testid="total-sessions">Total sessions: {sessions.length}</div>
      <div data-testid="total-minutes">Total minutes: {totalMinutes}</div>
      <div data-testid="total-stretches">Total stretches: {totalStretches}</div>

      {errors.length > 0 && (
        <ul data-testid="error-list">
          {errors.map((err, i) => (
            <li key={i} data-testid={`error-${i}`}>{err}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} data-testid="stretch-form">
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
          <label htmlFor="focus-area-select">Focus Area</label>
          <select
            id="focus-area-select"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            data-testid="focus-area-select"
          >
            <option value="">Select focus area</option>
            {FOCUS_AREAS.map((f) => (
              <option key={f} value={f}>{f}</option>
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
          <label htmlFor="stretches-input">Stretches</label>
          <input
            id="stretches-input"
            type="number"
            min={1}
            value={stretches}
            onChange={(e) => setStretches(e.target.value)}
            data-testid="stretches-input"
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
            <span data-testid={`session-focus-${s.id}`}>{s.focusArea}</span>
            <span data-testid={`session-duration-${s.id}`}>{s.duration} min</span>
            <span data-testid={`session-stretches-${s.id}`}>{s.stretches} stretches</span>
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
