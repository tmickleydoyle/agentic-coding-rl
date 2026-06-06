import { useState } from "react";

type Quality = "good" | "fair" | "poor";

interface SleepSession {
  id: number;
  date: string;
  sleepTime: string;
  wakeTime: string;
  durationHours: number;
  quality: Quality;
  notes: string;
}

const SEED_SESSIONS: SleepSession[] = [
  { id: 1, date: "2024-01-15", sleepTime: "20:00", wakeTime: "06:00", durationHours: 10, quality: "good", notes: "Slept through the night" },
  { id: 2, date: "2024-01-16", sleepTime: "20:30", wakeTime: "02:00", durationHours: 5.5, quality: "poor", notes: "Night waking" },
  { id: 3, date: "2024-01-16", sleepTime: "14:00", wakeTime: "15:30", durationHours: 1.5, quality: "good", notes: "Afternoon nap" },
  { id: 4, date: "2024-01-17", sleepTime: "21:00", wakeTime: "07:00", durationHours: 10, quality: "good", notes: "Great night" },
  { id: 5, date: "2024-01-17", sleepTime: "13:30", wakeTime: "14:30", durationHours: 1, quality: "fair", notes: "Short nap" },
];

export default function App() {
  const [sessions, setSessions] = useState<SleepSession[]>(SEED_SESSIONS);
  const [date, setDate] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [quality, setQuality] = useState<Quality>("good");
  const [notes, setNotes] = useState("");
  const [nextId, setNextId] = useState(6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dur = parseFloat(durationHours);
    if (!date || !sleepTime || !wakeTime || !durationHours || isNaN(dur) || dur <= 0) return;
    const session: SleepSession = {
      id: nextId,
      date,
      sleepTime,
      wakeTime,
      durationHours: dur,
      quality,
      notes,
    };
    setSessions([session, ...sessions]);
    setNextId(nextId + 1);
    setDate("");
    setSleepTime("");
    setWakeTime("");
    setDurationHours("");
    setNotes("");
  };

  const handleDelete = (id: number) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const avgDuration =
    sessions.length === 0
      ? "0.0"
      : (sessions.reduce((sum, s) => sum + s.durationHours, 0) / sessions.length).toFixed(1);

  const countGood = sessions.filter((s) => s.quality === "good").length;
  const countPoor = sessions.filter((s) => s.quality === "poor").length;

  return (
    <div>
      <h1>Sleep Schedule</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label htmlFor="sleep-time">Sleep Time</label>
        <input
          id="sleep-time"
          type="time"
          value={sleepTime}
          onChange={(e) => setSleepTime(e.target.value)}
        />

        <label htmlFor="wake-time">Wake Time</label>
        <input
          id="wake-time"
          type="time"
          value={wakeTime}
          onChange={(e) => setWakeTime(e.target.value)}
        />

        <label htmlFor="duration">Duration (hours)</label>
        <input
          id="duration"
          type="number"
          value={durationHours}
          onChange={(e) => setDurationHours(e.target.value)}
          min="0.1"
          step="0.5"
        />

        <label htmlFor="quality">Quality</label>
        <select
          id="quality"
          value={quality}
          onChange={(e) => setQuality(e.target.value as Quality)}
        >
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>

        <label htmlFor="notes">Notes</label>
        <input
          id="notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit">Add Sleep Session</button>
      </form>

      <div>
        <span data-testid="avg-duration">Avg: {avgDuration}</span>
        <span data-testid="count-good">Good: {countGood}</span>
        <span data-testid="count-poor">Poor: {countPoor}</span>
      </div>

      <ul>
        {sessions.map((s) => (
          <li key={s.id} data-testid="sleep-item">
            <span data-testid="sleep-date">{s.date}</span>
            <span data-testid="sleep-time">{s.sleepTime}</span>
            <span data-testid="wake-time">{s.wakeTime}</span>
            <span data-testid="sleep-duration">{s.durationHours}</span>
            <span data-testid="sleep-quality">{s.quality}</span>
            <span data-testid="sleep-notes">{s.notes}</span>
            <button onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
