import React, { useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { StepEntry, StepGoal } from "../lib/types";

function HomePage() {
  const { entries, goal, navigate } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = entries.find((e) => e.date === today);
  const totalSteps = entries.reduce((a, e) => a + e.steps, 0);
  const goalMetDays = entries.filter((e) => e.goalMet).length;

  return (
    <div data-testid="home-page">
      <h1>Step Counter</h1>
      <p data-testid="daily-goal">Daily goal: {goal.dailyTarget}</p>
      <p data-testid="total-steps">Total steps: {totalSteps}</p>
      <p data-testid="goal-met-days">Days goal met: {goalMetDays}</p>
      {todayEntry ? (
        <div data-testid="today-steps">
          <span data-testid="today-count">{todayEntry.steps}</span>
          <span data-testid="today-goal-met">{todayEntry.goalMet ? "Goal met!" : "Keep going!"}</span>
        </div>
      ) : (
        <p data-testid="no-today">No steps logged today.</p>
      )}
      <button data-testid="go-log" onClick={() => navigate("log")}>Log Steps</button>
    </div>
  );
}

function LogPage() {
  const { setEntries, navigate } = useApp();
  const [date, setDate] = React.useState("");
  const [steps, setSteps] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const s = parseInt(steps);
    if (!date || isNaN(s) || s <= 0) { setError("Date and positive step count required."); return; }
    const res = await fetch("/api/steps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, steps: s, notes }),
    });
    if (res.ok) {
      const all = await fetch("/api/steps");
      const data = await all.json() as { entries: StepEntry[] };
      setEntries(data.entries);
      navigate("history");
    }
  }

  return (
    <div data-testid="log-page">
      <h2>Log Steps</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleSubmit} data-testid="log-form">
        <input type="date" data-testid="input-date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="number" data-testid="input-steps" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="Steps" />
        <input data-testid="input-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" />
        <button type="submit" data-testid="submit-log">Save</button>
      </form>
    </div>
  );
}

function HistoryPage() {
  const { entries, goal } = useApp();
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  return (
    <div data-testid="history-page">
      <h2>Step History</h2>
      {sorted.length === 0 && <p data-testid="no-entries">No entries yet.</p>}
      <ul data-testid="entries-list">
        {sorted.map((e) => (
          <li key={e.id} data-testid={`entry-item-${e.id}`}>
            <span data-testid="entry-date">{e.date}</span>
            <span data-testid="entry-steps">{e.steps}</span>
            <span data-testid="entry-distance">{e.distanceKm}km</span>
            <span data-testid="entry-calories">{e.caloriesBurned} cal</span>
            <span data-testid="entry-goal-met">{e.goalMet ? "✓" : "✗"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GoalsPage() {
  const { goal, setGoal } = useApp();
  const [target, setTarget] = React.useState(String(goal.dailyTarget));
  const [saved, setSaved] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = parseInt(target);
    if (isNaN(t) || t <= 0) return;
    const res = await fetch("/api/steps/goal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dailyTarget: t }),
    });
    if (res.ok) {
      const data = await res.json() as { goal: StepGoal };
      setGoal(data.goal);
      setSaved(true);
    }
  }

  return (
    <div data-testid="goals-page">
      <h2>Step Goals</h2>
      <p data-testid="current-goal">Current goal: {goal.dailyTarget} steps/day</p>
      {saved && <p data-testid="goal-saved">Goal saved!</p>}
      <form onSubmit={handleSubmit} data-testid="goal-form">
        <input type="number" data-testid="input-target" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Daily step target" />
        <button type="submit" data-testid="save-goal">Save Goal</button>
      </form>
    </div>
  );
}

function Shell() {
  const { route, setEntries, setGoal } = useApp();

  useEffect(() => {
    fetch("/api/steps")
      .then((r) => r.json())
      .then((data: { entries: StepEntry[]; goal: StepGoal }) => {
        setEntries(data.entries);
        setGoal(data.goal);
      })
      .catch(() => {});
  }, []);

  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "home" && <HomePage />}
      {route === "log" && <LogPage />}
      {route === "history" && <HistoryPage />}
      {route === "goals" && <GoalsPage />}
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
