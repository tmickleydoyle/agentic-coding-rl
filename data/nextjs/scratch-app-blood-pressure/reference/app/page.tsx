import React, { useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { BPReading } from "../lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  normal: "Normal",
  elevated: "Elevated",
  "high-1": "High Stage 1",
  "high-2": "High Stage 2",
  crisis: "Hypertensive Crisis",
};

function HomePage() {
  const { readings, navigate } = useApp();
  const sorted = [...readings].sort((a, b) => b.createdAt - a.createdAt);
  const latest = sorted[0];

  return (
    <div data-testid="home-page">
      <h1>Blood Pressure Monitor</h1>
      <p data-testid="reading-count">Total readings: {readings.length}</p>
      {latest ? (
        <div data-testid="latest-reading">
          <span data-testid="latest-systolic">{latest.systolic}</span>
          <span data-testid="latest-diastolic">{latest.diastolic}</span>
          <span data-testid="latest-category">{CATEGORY_LABELS[latest.category]}</span>
        </div>
      ) : (
        <p data-testid="no-readings">No readings yet.</p>
      )}
      <button data-testid="go-record" onClick={() => navigate("record")}>Record Reading</button>
    </div>
  );
}

function RecordPage() {
  const { setReadings, navigate } = useApp();
  const [systolic, setSystolic] = React.useState("");
  const [diastolic, setDiastolic] = React.useState("");
  const [pulse, setPulse] = React.useState("");
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const s = parseInt(systolic);
    const d = parseInt(diastolic);
    const p = parseInt(pulse);
    if (isNaN(s) || s <= 0 || isNaN(d) || d <= 0) {
      setError("Systolic and diastolic values are required.");
      return;
    }
    const res = await fetch("/api/readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systolic: s, diastolic: d, pulse: isNaN(p) ? 0 : p, note,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toTimeString().slice(0, 5),
      }),
    });
    if (res.ok) {
      const all = await fetch("/api/readings");
      const data = await all.json() as { readings: BPReading[] };
      setReadings(data.readings);
      navigate("history");
    }
  }

  return (
    <div data-testid="record-page">
      <h2>Record Reading</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleSubmit} data-testid="record-form">
        <input data-testid="input-systolic" value={systolic} onChange={(e) => setSystolic(e.target.value)} placeholder="Systolic" type="number" />
        <input data-testid="input-diastolic" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} placeholder="Diastolic" type="number" />
        <input data-testid="input-pulse" value={pulse} onChange={(e) => setPulse(e.target.value)} placeholder="Pulse" type="number" />
        <input data-testid="input-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" />
        <button type="submit" data-testid="submit-reading">Save</button>
      </form>
    </div>
  );
}

function HistoryPage() {
  const { readings } = useApp();
  const sorted = [...readings].sort((a, b) => b.createdAt - a.createdAt);
  return (
    <div data-testid="history-page">
      <h2>Reading History</h2>
      {sorted.length === 0 && <p data-testid="no-readings">No readings yet.</p>}
      <ul data-testid="readings-list">
        {sorted.map((r) => (
          <li key={r.id} data-testid={`reading-item-${r.id}`}>
            <span data-testid="reading-date">{r.date}</span>
            <span data-testid="reading-time">{r.time}</span>
            <span data-testid="reading-systolic">{r.systolic}</span>
            <span data-testid="reading-diastolic">{r.diastolic}</span>
            <span data-testid="reading-category">{CATEGORY_LABELS[r.category]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrendsPage() {
  const { readings } = useApp();
  if (readings.length === 0) {
    return <div data-testid="trends-page"><h2>Trends</h2><p data-testid="no-data">No data yet.</p></div>;
  }
  const avgS = Math.round(readings.reduce((a, r) => a + r.systolic, 0) / readings.length);
  const avgD = Math.round(readings.reduce((a, r) => a + r.diastolic, 0) / readings.length);
  const avgP = Math.round(readings.reduce((a, r) => a + r.pulse, 0) / readings.length);
  const cats: Record<string, number> = {};
  readings.forEach((r) => { cats[r.category] = (cats[r.category] || 0) + 1; });

  return (
    <div data-testid="trends-page">
      <h2>Trends</h2>
      <p data-testid="avg-systolic">Avg systolic: {avgS}</p>
      <p data-testid="avg-diastolic">Avg diastolic: {avgD}</p>
      <p data-testid="avg-pulse">Avg pulse: {avgP}</p>
      <div data-testid="category-breakdown">
        {Object.keys(cats).map((cat) => (
          <div key={cat} data-testid={`cat-${cat}`}>{CATEGORY_LABELS[cat]}: {cats[cat]}</div>
        ))}
      </div>
    </div>
  );
}

function Shell() {
  const { route, setReadings } = useApp();

  useEffect(() => {
    fetch("/api/readings")
      .then((r) => r.json())
      .then((data: { readings: BPReading[] }) => setReadings(data.readings))
      .catch(() => {});
  }, []);

  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "home" && <HomePage />}
      {route === "record" && <RecordPage />}
      {route === "history" && <HistoryPage />}
      {route === "trends" && <TrendsPage />}
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
