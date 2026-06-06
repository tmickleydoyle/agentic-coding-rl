import React, { useState } from "react";

interface RecoveryEntry {
  id: number;
  date: string;
  activity: string;
  duration: number;
  intensity: string;
  notes: string;
}

const SEED_ENTRIES: RecoveryEntry[] = [
  { id: 1, date: "2024-05-01", activity: "Ice Bath", duration: 15, intensity: "High", notes: "Post-race" },
  { id: 2, date: "2024-05-03", activity: "Foam Rolling", duration: 20, intensity: "Low", notes: "Leg recovery" },
  { id: 3, date: "2024-05-05", activity: "Massage", duration: 60, intensity: "Medium", notes: "Full body" },
];

const ACTIVITIES = ["Ice Bath", "Foam Rolling", "Massage", "Sauna", "Sleep", "Active Recovery"];
const INTENSITIES = ["Low", "Medium", "High"];

export default function App() {
  const [entries, setEntries] = useState<RecoveryEntry[]>(SEED_ENTRIES);
  const [nextId, setNextId] = useState(4);
  const [date, setDate] = useState("");
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0);
  const highIntensityCount = entries.filter((e) => e.intensity === "High").length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: string[] = [];
    if (!date) errs.push("Date is required");
    if (!activity) errs.push("Activity is required");
    const dur = parseInt(duration, 10);
    if (!duration || isNaN(dur) || dur <= 0) errs.push("Duration must be positive");
    if (!intensity) errs.push("Intensity is required");
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    const newEntry: RecoveryEntry = { id: nextId, date, activity, duration: dur, intensity, notes };
    setEntries((prev) => [...prev, newEntry]);
    setNextId((n) => n + 1);
    setDate("");
    setActivity("");
    setDuration("");
    setIntensity("");
    setNotes("");
    setErrors([]);
  }

  function handleDelete(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div>
      <h1>Recovery Log</h1>

      <div data-testid="total-sessions">Total sessions: {entries.length}</div>
      <div data-testid="total-minutes">Total minutes: {totalMinutes}</div>
      <div data-testid="high-intensity-sessions">High intensity sessions: {highIntensityCount}</div>

      {errors.length > 0 && (
        <ul data-testid="error-list">
          {errors.map((err, i) => (
            <li key={i} data-testid={`error-${i}`}>{err}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} data-testid="recovery-form">
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
          <label htmlFor="activity-select">Activity</label>
          <select
            id="activity-select"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            data-testid="activity-select"
          >
            <option value="">Select activity</option>
            {ACTIVITIES.map((a) => (
              <option key={a} value={a}>{a}</option>
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
          <label htmlFor="intensity-select">Intensity</label>
          <select
            id="intensity-select"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            data-testid="intensity-select"
          >
            <option value="">Select intensity</option>
            {INTENSITIES.map((i) => (
              <option key={i} value={i}>{i}</option>
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
        {entries.map((e) => (
          <li key={e.id} data-testid={`session-${e.id}`}>
            <span data-testid={`session-date-${e.id}`}>{e.date}</span>
            <span data-testid={`session-activity-${e.id}`}>{e.activity}</span>
            <span data-testid={`session-duration-${e.id}`}>{e.duration} min</span>
            <span data-testid={`session-intensity-${e.id}`}>{e.intensity}</span>
            {e.notes && <span data-testid={`session-notes-${e.id}`}>{e.notes}</span>}
            <button onClick={() => handleDelete(e.id)} data-testid={`delete-${e.id}`}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
