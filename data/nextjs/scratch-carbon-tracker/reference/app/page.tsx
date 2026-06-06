import React, { useState } from "react";

interface CarbonEntry {
  id: number;
  date: string;
  category: string;
  activity: string;
  kgco2: number;
}

const CATEGORIES = ["Transport", "Food", "Home", "Shopping", "Other"];

const SEED: CarbonEntry[] = [
  { id: 1, date: "2024-05-01", category: "Transport", activity: "Car commute 30 km", kgco2: 5.4 },
  { id: 2, date: "2024-05-03", category: "Food", activity: "Beef meal", kgco2: 6.0 },
  { id: 3, date: "2024-05-05", category: "Home", activity: "AC for 8 hours", kgco2: 3.2 },
  { id: 4, date: "2024-05-07", category: "Transport", activity: "Short-haul flight", kgco2: 90.0 },
  { id: 5, date: "2024-05-10", category: "Food", activity: "Vegetarian meal", kgco2: 0.8 },
];

let nextId = 6;

function topCategory(entries: CarbonEntry[]): string {
  if (entries.length === 0) return "None";
  const totals: Record<string, number> = {};
  entries.forEach((e) => {
    totals[e.category] = (totals[e.category] || 0) + e.kgco2;
  });
  let best = "";
  let bestVal = -1;
  Object.keys(totals).forEach((cat) => {
    if (totals[cat] > bestVal) {
      bestVal = totals[cat];
      best = cat;
    }
  });
  return best;
}

export default function App() {
  const [entries, setEntries] = useState<CarbonEntry[]>(SEED);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Transport");
  const [activity, setActivity] = useState("");
  const [kgco2, setKgco2] = useState("");
  const [error, setError] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  function handleAdd() {
    if (!date || !activity || kgco2 === "") {
      setError("All fields are required");
      return;
    }
    const kgNum = parseFloat(kgco2);
    if (kgNum < 0) {
      setError("kg CO2 must be non-negative");
      return;
    }
    setError("");
    setEntries((prev) => [
      ...prev,
      { id: nextId++, date, category, activity, kgco2: kgNum },
    ]);
    setDate("");
    setCategory("Transport");
    setActivity("");
    setKgco2("");
  }

  function handleDelete(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const filtered =
    catFilter === "All" ? sorted : sorted.filter((e) => e.category === catFilter);

  const totalKg = entries.reduce((s, e) => s + e.kgco2, 0);
  const avgKg = entries.length > 0 ? totalKg / entries.length : 0;
  const topCat = topCategory(entries);

  return (
    <div>
      <h1>Carbon Footprint Tracker</h1>

      <div>
        <label htmlFor="date-input">Date</label>
        <input
          id="date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          data-testid="date-input"
        />
        <label htmlFor="category-select">Category</label>
        <select
          id="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          data-testid="category-select"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label htmlFor="activity-input">Activity</label>
        <input
          id="activity-input"
          type="text"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          data-testid="activity-input"
        />
        <label htmlFor="kgco2-input">kg CO2</label>
        <input
          id="kgco2-input"
          type="number"
          value={kgco2}
          onChange={(e) => setKgco2(e.target.value)}
          data-testid="kgco2-input"
        />
        <button onClick={handleAdd} data-testid="add-button">
          Add Entry
        </button>
        {error && <p data-testid="error-message">{error}</p>}
      </div>

      <div>
        <label htmlFor="cat-filter">Filter by category</label>
        <select
          id="cat-filter"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          data-testid="cat-filter"
        >
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div data-testid="summary">
        <span data-testid="total-kgco2">{totalKg.toFixed(1)}</span>
        <span data-testid="avg-kgco2">{avgKg.toFixed(1)}</span>
        <span data-testid="entry-count">{entries.length}</span>
        <span data-testid="top-category">{topCat}</span>
      </div>

      <ul data-testid="entry-list">
        {filtered.map((entry) => (
          <li key={entry.id} data-testid={`entry-${entry.id}`}>
            <span data-testid={`entry-date-${entry.id}`}>{entry.date}</span>
            <span data-testid={`entry-category-${entry.id}`}>{entry.category}</span>
            <span data-testid={`entry-activity-${entry.id}`}>{entry.activity}</span>
            <span data-testid={`entry-kgco2-${entry.id}`}>{entry.kgco2}</span>
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
