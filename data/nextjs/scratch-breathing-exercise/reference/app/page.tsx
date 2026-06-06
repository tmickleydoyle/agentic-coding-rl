import React, { useState } from "react";

interface BreathingSession {
  id: number;
  date: string;
  technique: string;
  rounds: number;
  duration: number;
  notes: string;
}

const SEED_SESSIONS: BreathingSession[] = [
  { id: 1, date: "2024-03-01", technique: "Box Breathing", rounds: 5, duration: 10, notes: "Calm and focused" },
  { id: 2, date: "2024-03-03", technique: "4-7-8", rounds: 3, duration: 8, notes: "Pre-sleep routine" },
  { id: 3, date: "2024-03-05", technique: "Wim Hof", rounds: 3, duration: 15, notes: "Energizing" },
];

const TECHNIQUES = ["Box Breathing", "4-7-8", "Wim Hof", "Alternate Nostril", "Diaphragmatic"];

export default function App() {
  const [sessions, setSessions] = useState<BreathingSession[]>(SEED_SESSIONS);
  const [nextId, setNextId] = useState(4);
  const [date, setDate] = useState("");
  const [technique, setTechnique] = useState("");
  const [rounds, setRounds] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const totalRounds = sessions.reduce((sum, s) => sum + s.rounds, 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: string[] = [];
    if (!date) errs.push("Date is required");
    if (!technique) errs.push("Technique is required");
    const r = parseInt(rounds, 10);
    if (!rounds || isNaN(r) || r <= 0) errs.push("Rounds must be positive");
    const dur = parseInt(duration, 10);
    if (!duration || isNaN(dur) || dur <= 0) errs.push("Duration must be positive");
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    const newSession: BreathingSession = { id: nextId, date, technique, rounds: r, duration: dur, notes };
    setSessions((prev) => [...prev, newSession]);
    setNextId((n) => n + 1);
    setDate("");
    setTechnique("");
    setRounds("");
    setDuration("");
    setNotes("");
    setErrors([]);
  }

  function handleDelete(id: number) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <h1>Breathing Exercise Log</h1>

      <div data-testid="total-sessions">Total sessions: {sessions.length}</div>
      <div data-testid="total-rounds">Total rounds: {totalRounds}</div>
      <div data-testid="total-minutes">Total minutes: {totalMinutes}</div>

      {errors.length > 0 && (
        <ul data-testid="error-list">
          {errors.map((err, i) => (
            <li key={i} data-testid={`error-${i}`}>{err}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} data-testid="breathing-form">
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
          <label htmlFor="technique-select">Technique</label>
          <select
            id="technique-select"
            value={technique}
            onChange={(e) => setTechnique(e.target.value)}
            data-testid="technique-select"
          >
            <option value="">Select technique</option>
            {TECHNIQUES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rounds-input">Rounds</label>
          <input
            id="rounds-input"
            type="number"
            min={1}
            value={rounds}
            onChange={(e) => setRounds(e.target.value)}
            data-testid="rounds-input"
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
            <span data-testid={`session-technique-${s.id}`}>{s.technique}</span>
            <span data-testid={`session-rounds-${s.id}`}>{s.rounds} rounds</span>
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
