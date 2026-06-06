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
          <h1>Weight Log</h1>
          <p data-testid="entry-count">Logged 0 times</p>
          <p data-testid="no-entries">No entries yet.</p>
          <button data-testid="go-log">Log Weight</button>
        </div>
      )}
      {route === "log" && (
        <div data-testid="log-page">
          <h2>Log Weight</h2>
          <form data-testid="log-form">
            <input type="number" step="0.1" data-testid="input-weight" placeholder="Weight" />
            <select data-testid="input-unit">
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
            <input data-testid="input-note" placeholder="Note (optional)" />
            <button type="submit" data-testid="submit-log">Save</button>
          </form>
        </div>
      )}
      {route === "history" && (
        <div data-testid="history-page">
          <h2>Weight History</h2>
          <ul data-testid="entries-list" />
        </div>
      )}
      {route === "stats" && (
        <div data-testid="stats-page">
          <h2>Stats</h2>
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
