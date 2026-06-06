import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "home" && (
        <div data-testid="home-page">
          <h1>Mood Tracker</h1>
          <p data-testid="average-mood">Average mood: —</p>
          <p data-testid="log-count">Total logs: 0</p>
          <p data-testid="today-not-logged">You haven&apos;t logged today.</p>
          <button data-testid="go-log">Log Today&apos;s Mood</button>
        </div>
      )}
      {route === "log" && (
        <div data-testid="log-page">
          <h2>Log Mood</h2>
          <form data-testid="log-form">
            <input type="range" min={1} max={5} data-testid="input-level" defaultValue={3} />
            <span data-testid="level-label">Okay</span>
            <textarea data-testid="input-note" placeholder="How are you feeling?" />
            <input data-testid="input-activities" placeholder="Activities (comma separated)" />
            <button type="submit" data-testid="submit-log">Save</button>
          </form>
        </div>
      )}
      {route === "history" && (
        <div data-testid="history-page">
          <h2>Mood History</h2>
          <ul data-testid="logs-list" />
        </div>
      )}
      {route === "insights" && (
        <div data-testid="insights-page">
          <h2>Insights</h2>
          <p data-testid="insight-avg">Average: 0</p>
          <p data-testid="insight-count">Total: 0</p>
          <div data-testid="mood-distribution" />
        </div>
      )}
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
