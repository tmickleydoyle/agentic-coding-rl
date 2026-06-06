import React, { useState } from "react";

interface LogEntry {
  id: number;
  model_name: string;
  material: string;
  duration_min: number;
  result: "success" | "failure";
  rating: number;
  notes: string;
  date: string;
}

const SEED_ENTRIES: LogEntry[] = [
  { id: 1, model_name: "Benchy Boat", material: "PLA", duration_min: 45, result: "success", rating: 5, notes: "Perfect first layer", date: "2024-01-10" },
  { id: 2, model_name: "Phone Stand", material: "PETG", duration_min: 120, result: "success", rating: 4, notes: "Slight stringing on top", date: "2024-01-12" },
  { id: 3, model_name: "Dragon Figurine", material: "PLA", duration_min: 310, result: "failure", rating: 2, notes: "Warped off bed at 40%", date: "2024-01-14" },
  { id: 4, model_name: "Cable Organizer", material: "ABS", duration_min: 95, result: "success", rating: 3, notes: "ABS smell, needs enclosure", date: "2024-01-15" },
];

let nextId = 5;

export default function App() {
  const [entries, setEntries] = useState<LogEntry[]>(SEED_ENTRIES);
  const [filterMaterial, setFilterMaterial] = useState("All");

  const [modelName, setModelName] = useState("");
  const [material, setMaterial] = useState("");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<"success" | "failure">("success");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");

  function addEntry() {
    const dur = parseInt(duration, 10);
    const rat = parseInt(rating, 10);
    if (!modelName.trim() || !material.trim() || !date.trim()) return;
    if (isNaN(dur) || dur <= 0) return;
    if (isNaN(rat) || rat < 1 || rat > 5) return;
    const entry: LogEntry = {
      id: nextId++,
      model_name: modelName.trim(),
      material: material.trim(),
      duration_min: dur,
      result,
      rating: rat,
      notes,
      date: date.trim(),
    };
    setEntries((prev) => [...prev, entry]);
    setModelName(""); setMaterial(""); setDuration(""); setResult("success");
    setRating(""); setNotes(""); setDate("");
  }

  function deleteEntry(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const filtered = filterMaterial === "All"
    ? entries
    : entries.filter((e) => e.material.toLowerCase() === filterMaterial.toLowerCase());

  const total = filtered.length;
  const successCount = filtered.filter((e) => e.result === "success").length;
  const successRate = total === 0 ? "0%" : `${Math.round((successCount / total) * 100)}%`;
  const avgRating = total === 0 ? "0.0" : (filtered.reduce((s, e) => s + e.rating, 0) / total).toFixed(1);

  return (
    <div>
      <h1>Print Log</h1>

      <div>
        <input aria-label="Model name" value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="Model name" />
        <input aria-label="Material" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Material" />
        <input aria-label="Duration (min)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (min)" />
        <select aria-label="Result" value={result} onChange={(e) => setResult(e.target.value as "success" | "failure")}>
          <option value="success">success</option>
          <option value="failure">failure</option>
        </select>
        <input aria-label="Rating" type="number" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating (1-5)" min={1} max={5} />
        <textarea aria-label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <input aria-label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={addEntry}>Add Entry</button>
      </div>

      <div>
        <select
          data-testid="filter-material"
          aria-label="Filter by material"
          value={filterMaterial}
          onChange={(e) => setFilterMaterial(e.target.value)}
        >
          <option value="All">All</option>
          <option value="PLA">PLA</option>
          <option value="PETG">PETG</option>
          <option value="ABS">ABS</option>
          <option value="TPU">TPU</option>
        </select>
      </div>

      <ul>
        {filtered.map((entry) => (
          <li key={entry.id}>
            <span data-testid={`entry-model-${entry.id}`}>{entry.model_name}</span>
            <span data-testid={`entry-material-${entry.id}`}>{entry.material}</span>
            <span data-testid={`entry-duration-${entry.id}`}>{entry.duration_min}</span>
            <span data-testid={`entry-result-${entry.id}`}>{entry.result}</span>
            <span data-testid={`entry-rating-${entry.id}`}>{entry.rating}</span>
            <span data-testid={`entry-date-${entry.id}`}>{entry.date}</span>
            <button data-testid={`entry-delete-${entry.id}`} onClick={() => deleteEntry(entry.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div>
        <span data-testid="stats-total">{total}</span>
        <span data-testid="stats-success-rate">{successRate}</span>
        <span data-testid="stats-avg-rating">{avgRating}</span>
      </div>
    </div>
  );
}
