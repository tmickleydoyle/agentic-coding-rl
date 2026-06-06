import { useState } from "react";

type FeedingMethod = "breast" | "bottle" | "solid";

interface FeedingEntry {
  id: number;
  method: FeedingMethod;
  startTime: string;
  durationMinutes: number;
  amountOz: number;
  notes: string;
}

const SEED_FEEDINGS: FeedingEntry[] = [
  { id: 1, method: "breast", startTime: "06:30", durationMinutes: 20, amountOz: 0, notes: "Left side" },
  { id: 2, method: "bottle", startTime: "10:00", durationMinutes: 15, amountOz: 4, notes: "Formula" },
  { id: 3, method: "breast", startTime: "13:00", durationMinutes: 18, amountOz: 0, notes: "Both sides" },
  { id: 4, method: "bottle", startTime: "17:00", durationMinutes: 10, amountOz: 3, notes: "Breast milk" },
  { id: 5, method: "solid", startTime: "19:30", durationMinutes: 25, amountOz: 0, notes: "Pureed carrots" },
];

export default function App() {
  const [feedings, setFeedings] = useState<FeedingEntry[]>(SEED_FEEDINGS);
  const [method, setMethod] = useState<FeedingMethod>("breast");
  const [startTime, setStartTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [amountOz, setAmountOz] = useState("0");
  const [notes, setNotes] = useState("");
  const [nextId, setNextId] = useState(6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dur = parseInt(durationMinutes);
    if (!startTime.trim() || !notes.trim() || !dur || dur <= 0) return;
    const entry: FeedingEntry = {
      id: nextId,
      method,
      startTime,
      durationMinutes: dur,
      amountOz: parseFloat(amountOz) || 0,
      notes,
    };
    setFeedings([entry, ...feedings]);
    setNextId(nextId + 1);
    setStartTime("");
    setDurationMinutes("");
    setAmountOz("0");
    setNotes("");
  };

  const handleRemove = (id: number) => {
    setFeedings(feedings.filter((f) => f.id !== id));
  };

  const totalFeedings = feedings.length;
  const totalOz = feedings.reduce((sum, f) => sum + f.amountOz, 0);
  const totalDuration = feedings.reduce((sum, f) => sum + f.durationMinutes, 0);

  return (
    <div>
      <h1>Feeding Log</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="method">Method</label>
        <select
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value as FeedingMethod)}
        >
          <option value="breast">Breast</option>
          <option value="bottle">Bottle</option>
          <option value="solid">Solid</option>
        </select>

        <label htmlFor="start-time">Start Time</label>
        <input
          id="start-time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <label htmlFor="duration">Duration (min)</label>
        <input
          id="duration"
          type="number"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          min="1"
        />

        <label htmlFor="amount">Amount (oz)</label>
        <input
          id="amount"
          type="number"
          value={amountOz}
          onChange={(e) => setAmountOz(e.target.value)}
          min="0"
          step="0.5"
        />

        <label htmlFor="notes">Notes</label>
        <input
          id="notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit">Add Feeding</button>
      </form>

      <div>
        <span data-testid="total-feedings">Total: {totalFeedings}</span>
        <span data-testid="total-oz">Oz: {totalOz}</span>
        <span data-testid="total-duration">Minutes: {totalDuration}</span>
      </div>

      <ul>
        {feedings.map((f) => (
          <li key={f.id} data-testid="feeding-item">
            <span data-testid="feeding-method">{f.method}</span>
            <span data-testid="feeding-time">{f.startTime}</span>
            <span data-testid="feeding-duration">{f.durationMinutes}</span>
            <span data-testid="feeding-amount">{f.amountOz}</span>
            <span data-testid="feeding-notes">{f.notes}</span>
            <button onClick={() => handleRemove(f.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
