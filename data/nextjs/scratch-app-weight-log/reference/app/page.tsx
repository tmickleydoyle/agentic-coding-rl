import React, { useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { WeightEntry } from "../lib/types";

function HomePage() {
  const { entries, navigate } = useApp();
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  const latest = sorted[0];

  return (
    <div data-testid="home-page">
      <h1>Weight Log</h1>
      <p data-testid="entry-count">Logged {entries.length} times</p>
      {latest ? (
        <div data-testid="latest-entry">
          <span data-testid="latest-weight">{latest.weight} {latest.unit}</span>
          <span data-testid="latest-date">{latest.date}</span>
        </div>
      ) : (
        <p data-testid="no-entries">No entries yet.</p>
      )}
      <button data-testid="go-log" onClick={() => navigate("log")}>Log Weight</button>
    </div>
  );
}

function LogPage() {
  const { setEntries, navigate } = useApp();
  const [weight, setWeight] = React.useState("");
  const [unit, setUnit] = React.useState("kg");
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) { setError("Valid weight required."); return; }
    const res = await fetch("/api/weights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight: w, unit, note, date: new Date().toISOString().slice(0, 10) }),
    });
    if (res.ok) {
      const all = await fetch("/api/weights");
      const data = await all.json() as { entries: WeightEntry[] };
      setEntries(data.entries);
      navigate("history");
    }
  }

  return (
    <div data-testid="log-page">
      <h2>Log Weight</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleSubmit} data-testid="log-form">
        <input data-testid="input-weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" type="number" step="0.1" />
        <select data-testid="input-unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
        </select>
        <input data-testid="input-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" />
        <button type="submit" data-testid="submit-log">Save</button>
      </form>
    </div>
  );
}

function HistoryPage() {
  const { entries } = useApp();
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  return (
    <div data-testid="history-page">
      <h2>Weight History</h2>
      {sorted.length === 0 && <p data-testid="no-entries">No entries yet.</p>}
      <ul data-testid="entries-list">
        {sorted.map((e) => (
          <li key={e.id} data-testid={`entry-item-${e.id}`}>
            <span data-testid="entry-date">{e.date}</span>
            <span data-testid="entry-weight">{e.weight}</span>
            <span data-testid="entry-unit">{e.unit}</span>
            <span data-testid="entry-note">{e.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatsPage() {
  const { entries } = useApp();
  if (entries.length === 0) {
    return <div data-testid="stats-page"><h2>Stats</h2><p data-testid="no-data">No data yet.</p></div>;
  }
  const sorted = [...entries].sort((a, b) => a.createdAt - b.createdAt);
  const weights = sorted.map((e) => e.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const avg = (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1);
  const change = (sorted[sorted.length - 1].weight - sorted[0].weight).toFixed(1);

  return (
    <div data-testid="stats-page">
      <h2>Stats</h2>
      <p data-testid="stat-min">Min: {min}</p>
      <p data-testid="stat-max">Max: {max}</p>
      <p data-testid="stat-avg">Avg: {avg}</p>
      <p data-testid="stat-change">Change: {change}</p>
    </div>
  );
}

function Shell() {
  const { route, setEntries } = useApp();

  useEffect(() => {
    fetch("/api/weights")
      .then((r) => r.json())
      .then((data: { entries: WeightEntry[] }) => setEntries(data.entries))
      .catch(() => {});
  }, []);

  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "home" && <HomePage />}
      {route === "log" && <LogPage />}
      {route === "history" && <HistoryPage />}
      {route === "stats" && <StatsPage />}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
