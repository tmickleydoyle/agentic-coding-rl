import React, { useState } from "react";

interface EnergyEntry {
  id: number;
  month: string;
  source: string;
  kwh: number;
  cost: number;
}

const SOURCES = ["Electricity", "Gas", "Solar", "Water"];

const SEED: EnergyEntry[] = [
  { id: 1, month: "2024-01", source: "Electricity", kwh: 320, cost: 48.0 },
  { id: 2, month: "2024-01", source: "Gas", kwh: 150, cost: 22.5 },
  { id: 3, month: "2024-02", source: "Electricity", kwh: 295, cost: 44.25 },
  { id: 4, month: "2024-02", source: "Gas", kwh: 130, cost: 19.5 },
  { id: 5, month: "2024-03", source: "Electricity", kwh: 310, cost: 46.5 },
];

let nextId = 6;

export default function App() {
  const [entries, setEntries] = useState<EnergyEntry[]>(SEED);
  const [month, setMonth] = useState("");
  const [source, setSource] = useState("Electricity");
  const [kwh, setKwh] = useState("");
  const [cost, setCost] = useState("");
  const [error, setError] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");

  function handleAdd() {
    if (!month || !source || kwh === "" || cost === "") {
      setError("All fields are required");
      return;
    }
    const kwhNum = parseFloat(kwh);
    const costNum = parseFloat(cost);
    if (kwhNum < 0 || costNum < 0) {
      setError("Values must be non-negative");
      return;
    }
    setError("");
    setEntries((prev) => [
      ...prev,
      { id: nextId++, month, source, kwh: kwhNum, cost: costNum },
    ]);
    setMonth("");
    setSource("Electricity");
    setKwh("");
    setCost("");
  }

  function handleDelete(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const sorted = [...entries].sort((a, b) => {
    const md = b.month.localeCompare(a.month);
    if (md !== 0) return md;
    return a.source.localeCompare(b.source);
  });

  const filtered =
    sourceFilter === "All"
      ? sorted
      : sorted.filter((e) => e.source === sourceFilter);

  const totalKwh = entries.reduce((s, e) => s + e.kwh, 0);
  const totalCost = entries.reduce((s, e) => s + e.cost, 0);

  return (
    <div>
      <h1>Energy Usage Tracker</h1>

      <div>
        <label htmlFor="month-input">Month</label>
        <input
          id="month-input"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          data-testid="month-input"
        />
        <label htmlFor="source-select">Source</label>
        <select
          id="source-select"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          data-testid="source-select"
        >
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label htmlFor="kwh-input">kWh</label>
        <input
          id="kwh-input"
          type="number"
          value={kwh}
          onChange={(e) => setKwh(e.target.value)}
          data-testid="kwh-input"
        />
        <label htmlFor="cost-input">Cost ($)</label>
        <input
          id="cost-input"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          data-testid="cost-input"
        />
        <button onClick={handleAdd} data-testid="add-button">
          Add Entry
        </button>
        {error && <p data-testid="error-message">{error}</p>}
      </div>

      <div>
        <label htmlFor="source-filter">Filter by source</label>
        <select
          id="source-filter"
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          data-testid="source-filter"
        >
          <option value="All">All</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div data-testid="summary">
        <span data-testid="total-kwh">{totalKwh.toFixed(1)}</span>
        <span data-testid="total-cost">${totalCost.toFixed(2)}</span>
        <span data-testid="entry-count">{entries.length}</span>
      </div>

      <ul data-testid="entry-list">
        {filtered.map((entry) => (
          <li key={entry.id} data-testid={`entry-${entry.id}`}>
            <span data-testid={`entry-month-${entry.id}`}>{entry.month}</span>
            <span data-testid={`entry-source-${entry.id}`}>
              {entry.source}
            </span>
            <span data-testid={`entry-kwh-${entry.id}`}>{entry.kwh}</span>
            <span data-testid={`entry-cost-${entry.id}`}>
              ${entry.cost.toFixed(2)}
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
