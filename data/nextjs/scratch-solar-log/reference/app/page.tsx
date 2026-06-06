import React, { useState } from "react";

interface SolarEntry {
  id: number;
  date: string;
  kwh: number;
  notes: string;
}

const SEED: SolarEntry[] = [
  { id: 1, date: "2024-06-01", kwh: 22.5, notes: "Sunny all day" },
  { id: 2, date: "2024-06-02", kwh: 18.3, notes: "Partly cloudy" },
  { id: 3, date: "2024-06-03", kwh: 5.1, notes: "Overcast" },
  { id: 4, date: "2024-06-04", kwh: 25.0, notes: "Perfect conditions" },
];

let nextId = 5;

export default function App() {
  const [entries, setEntries] = useState<SolarEntry[]>(SEED);
  const [date, setDate] = useState("");
  const [kwh, setKwh] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  function handleAdd() {
    if (!date || kwh === "") {
      setError("Date and kWh are required");
      return;
    }
    const kwhNum = parseFloat(kwh);
    if (kwhNum < 0) {
      setError("kWh must be non-negative");
      return;
    }
    setError("");
    setEntries((prev) => [
      ...prev,
      { id: nextId++, date, kwh: kwhNum, notes },
    ]);
    setDate("");
    setKwh("");
    setNotes("");
  }

  function handleDelete(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const filtered = filter
    ? sorted.filter((e) =>
        e.notes.toLowerCase().includes(filter.toLowerCase())
      )
    : sorted;

  const totalKwh = entries.reduce((s, e) => s + e.kwh, 0);
  const avgKwh = entries.length > 0 ? totalKwh / entries.length : 0;

  return (
    <div>
      <h1>Solar Log</h1>

      <div>
        <label htmlFor="date-input">Date</label>
        <input
          id="date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          data-testid="date-input"
        />
        <label htmlFor="kwh-input">kWh Produced</label>
        <input
          id="kwh-input"
          type="number"
          value={kwh}
          onChange={(e) => setKwh(e.target.value)}
          data-testid="kwh-input"
        />
        <label htmlFor="notes-input">Notes</label>
        <input
          id="notes-input"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          data-testid="notes-input"
        />
        <button onClick={handleAdd} data-testid="add-button">
          Add Entry
        </button>
        {error && <p data-testid="error-message">{error}</p>}
      </div>

      <div>
        <label htmlFor="filter-input">Filter by notes</label>
        <input
          id="filter-input"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          data-testid="filter-input"
        />
      </div>

      <div data-testid="summary">
        <span data-testid="total-kwh">{totalKwh.toFixed(1)}</span>
        <span data-testid="avg-kwh">{avgKwh.toFixed(1)}</span>
        <span data-testid="entry-count">{entries.length}</span>
      </div>

      <ul data-testid="entry-list">
        {filtered.map((entry) => (
          <li key={entry.id} data-testid={`entry-${entry.id}`}>
            <span data-testid={`entry-date-${entry.id}`}>{entry.date}</span>
            <span data-testid={`entry-kwh-${entry.id}`}>{entry.kwh}</span>
            <span data-testid={`entry-notes-${entry.id}`}>
              {entry.notes || "—"}
            </span>
            <button
              onClick={() => handleDelete(entry.id)}
              data-testid={`delete-${entry.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
