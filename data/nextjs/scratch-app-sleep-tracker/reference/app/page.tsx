import React, { useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { SleepEntry } from "../lib/types";

const QUALITY_LABELS: Record<number, string> = { 1: "Terrible", 2: "Poor", 3: "Fair", 4: "Good", 5: "Excellent" };

function HomePage() {
  const { entries, navigate } = useApp();
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  const latest = sorted[0];
  const avgDuration = entries.length
    ? (entries.reduce((a, e) => a + e.durationHours, 0) / entries.length).toFixed(1)
    : "—";

  return (
    <div data-testid="home-page">
      <h1>Sleep Tracker</h1>
      <p data-testid="entry-count">Nights logged: {entries.length}</p>
      <p data-testid="avg-duration">Average sleep: {avgDuration}h</p>
      {latest ? (
        <div data-testid="latest-entry">
          <span data-testid="latest-date">{latest.date}</span>
          <span data-testid="latest-duration">{latest.durationHours}h</span>
          <span data-testid="latest-quality">{QUALITY_LABELS[latest.quality]}</span>
        </div>
      ) : (
        <p data-testid="no-entries">No entries yet.</p>
      )}
      <button data-testid="go-log" onClick={() => navigate("log")}>Log Sleep</button>
    </div>
  );
}

function LogPage() {
  const { setEntries, navigate } = useApp();
  const [date, setDate] = React.useState("");
  const [bedtime, setBedtime] = React.useState("");
  const [wakeTime, setWakeTime] = React.useState("");
  const [quality, setQuality] = React.useState<number>(3);
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !bedtime || !wakeTime) { setError("Date, bedtime and wake time are required."); return; }
    const res = await fetch("/api/sleep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, bedtime, wakeTime, quality: Number(quality), notes }),
    });
    if (res.ok) {
      const all = await fetch("/api/sleep");
      const data = await all.json() as { entries: SleepEntry[] };
      setEntries(data.entries);
      navigate("history");
    }
  }

  return (
    <div data-testid="log-page">
      <h2>Log Sleep</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleSubmit} data-testid="log-form">
        <input type="date" data-testid="input-date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" data-testid="input-bedtime" value={bedtime} onChange={(e) => setBedtime(e.target.value)} placeholder="Bedtime" />
        <input type="time" data-testid="input-wake-time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} placeholder="Wake time" />
        <input type="range" min={1} max={5} data-testid="input-quality" value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
        <span data-testid="quality-label">{QUALITY_LABELS[quality]}</span>
        <textarea data-testid="input-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
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
      <h2>Sleep History</h2>
      {sorted.length === 0 && <p data-testid="no-entries">No entries yet.</p>}
      <ul data-testid="entries-list">
        {sorted.map((e) => (
          <li key={e.id} data-testid={`entry-item-${e.id}`}>
            <span data-testid="entry-date">{e.date}</span>
            <span data-testid="entry-duration">{e.durationHours}h</span>
            <span data-testid="entry-quality">{QUALITY_LABELS[e.quality]}</span>
            <span data-testid="entry-bedtime">{e.bedtime}</span>
            <span data-testid="entry-wake">{e.wakeTime}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightsPage() {
  const { entries } = useApp();
  if (entries.length === 0) {
    return <div data-testid="insights-page"><h2>Insights</h2><p data-testid="no-data">No data yet.</p></div>;
  }
  const avgDuration = (entries.reduce((a, e) => a + e.durationHours, 0) / entries.length).toFixed(1);
  const avgQuality = (entries.reduce((a, e) => a + e.quality, 0) / entries.length).toFixed(1);
  const best = entries.reduce((a, b) => (a.quality >= b.quality ? a : b));
  const worst = entries.reduce((a, b) => (a.quality <= b.quality ? a : b));

  return (
    <div data-testid="insights-page">
      <h2>Insights</h2>
      <p data-testid="insight-avg-duration">Avg duration: {avgDuration}h</p>
      <p data-testid="insight-avg-quality">Avg quality: {avgQuality}</p>
      <p data-testid="insight-best">Best night: {best.date}</p>
      <p data-testid="insight-worst">Worst night: {worst.date}</p>
    </div>
  );
}

function Shell() {
  const { route, setEntries } = useApp();

  useEffect(() => {
    fetch("/api/sleep")
      .then((r) => r.json())
      .then((data: { entries: SleepEntry[] }) => setEntries(data.entries))
      .catch(() => {});
  }, []);

  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "home" && <HomePage />}
      {route === "log" && <LogPage />}
      {route === "history" && <HistoryPage />}
      {route === "insights" && <InsightsPage />}
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
