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
          <h1>Sleep Tracker</h1>
          <p data-testid="entry-count">Nights logged: 0</p>
          <p data-testid="avg-duration">Average sleep: —h</p>
          <p data-testid="no-entries">No entries yet.</p>
          <button data-testid="go-log">Log Sleep</button>
        </div>
      )}
      {route === "log" && (
        <div data-testid="log-page">
          <h2>Log Sleep</h2>
          <form data-testid="log-form">
            <input type="date" data-testid="input-date" />
            <input type="time" data-testid="input-bedtime" placeholder="Bedtime" />
            <input type="time" data-testid="input-wake-time" placeholder="Wake time" />
            <input type="range" min={1} max={5} data-testid="input-quality" defaultValue={3} />
            <span data-testid="quality-label">Fair</span>
            <textarea data-testid="input-notes" placeholder="Notes" />
            <button type="submit" data-testid="submit-log">Save</button>
          </form>
        </div>
      )}
      {route === "history" && (
        <div data-testid="history-page">
          <h2>Sleep History</h2>
          <ul data-testid="entries-list" />
        </div>
      )}
      {route === "insights" && (
        <div data-testid="insights-page">
          <h2>Insights</h2>
          <p data-testid="no-data">No data yet.</p>
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
