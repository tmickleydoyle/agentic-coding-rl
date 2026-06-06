import React, { useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { MoodLog } from "../lib/types";

const MOOD_LABELS: Record<number, string> = { 1: "Terrible", 2: "Bad", 3: "Okay", 4: "Good", 5: "Great" };

function HomePage() {
  const { logs, navigate } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const todayLog = logs.find((l) => l.date === today);
  const avg = logs.length
    ? (logs.reduce((a, l) => a + l.level, 0) / logs.length).toFixed(1)
    : "—";

  return (
    <div data-testid="home-page">
      <h1>Mood Tracker</h1>
      <p data-testid="average-mood">Average mood: {avg}</p>
      <p data-testid="log-count">Total logs: {logs.length}</p>
      {todayLog ? (
        <p data-testid="today-logged">Today: {MOOD_LABELS[todayLog.level]}</p>
      ) : (
        <p data-testid="today-not-logged">You haven&apos;t logged today.</p>
      )}
      <button data-testid="go-log" onClick={() => navigate("log")}>Log Today&apos;s Mood</button>
    </div>
  );
}

function LogPage() {
  const { setLogs, navigate } = useApp();
  const [level, setLevel] = React.useState<number>(3);
  const [note, setNote] = React.useState("");
  const [activities, setActivities] = React.useState("");
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) { setError("Note is required."); return; }
    const res = await fetch("/api/moods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level: Number(level),
        note,
        activities: activities.split(",").map((a) => a.trim()).filter(Boolean),
        date: new Date().toISOString().slice(0, 10),
      }),
    });
    if (res.ok) {
      const all = await fetch("/api/moods");
      const data = await all.json() as { logs: MoodLog[] };
      setLogs(data.logs);
      navigate("history");
    }
  }

  return (
    <div data-testid="log-page">
      <h2>Log Mood</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleSubmit} data-testid="log-form">
        <input
          type="range" min={1} max={5}
          data-testid="input-level"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        />
        <span data-testid="level-label">{MOOD_LABELS[level]}</span>
        <textarea
          data-testid="input-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How are you feeling?"
        />
        <input
          data-testid="input-activities"
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
          placeholder="Activities (comma separated)"
        />
        <button type="submit" data-testid="submit-log">Save</button>
      </form>
    </div>
  );
}

function HistoryPage() {
  const { logs } = useApp();
  const sorted = [...logs].sort((a, b) => b.createdAt - a.createdAt);
  return (
    <div data-testid="history-page">
      <h2>Mood History</h2>
      {sorted.length === 0 && <p data-testid="no-logs">No logs yet.</p>}
      <ul data-testid="logs-list">
        {sorted.map((l) => (
          <li key={l.id} data-testid={`log-item-${l.id}`}>
            <span data-testid="log-date">{l.date}</span>
            <span data-testid="log-level">{l.level}</span>
            <span data-testid="log-mood-label">{MOOD_LABELS[l.level]}</span>
            <span data-testid="log-note">{l.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightsPage() {
  const { logs } = useApp();
  const avg = logs.length
    ? (logs.reduce((a, l) => a + l.level, 0) / logs.length).toFixed(1)
    : "0";
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  logs.forEach((l) => { dist[l.level] = (dist[l.level] || 0) + 1; });
  const best = logs.length ? logs.reduce((a, b) => (a.level >= b.level ? a : b)) : null;

  return (
    <div data-testid="insights-page">
      <h2>Insights</h2>
      <p data-testid="insight-avg">Average: {avg}</p>
      <p data-testid="insight-count">Total: {logs.length}</p>
      {best && <p data-testid="insight-best">Best day: {best.date}</p>}
      <div data-testid="mood-distribution">
        {[1, 2, 3, 4, 5].map((lvl) => (
          <div key={lvl} data-testid={`dist-${lvl}`}>
            {MOOD_LABELS[lvl]}: {dist[lvl]}
          </div>
        ))}
      </div>
    </div>
  );
}

function Shell() {
  const { route, setLogs } = useApp();

  useEffect(() => {
    fetch("/api/moods")
      .then((r) => r.json())
      .then((data: { logs: MoodLog[] }) => setLogs(data.logs))
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
