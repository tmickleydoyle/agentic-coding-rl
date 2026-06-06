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
          <h1>Blood Pressure Monitor</h1>
          <p data-testid="reading-count">Total readings: 0</p>
          <p data-testid="no-readings">No readings yet.</p>
          <button data-testid="go-record">Record Reading</button>
        </div>
      )}
      {route === "record" && (
        <div data-testid="record-page">
          <h2>Record Reading</h2>
          <form data-testid="record-form">
            <input type="number" data-testid="input-systolic" placeholder="Systolic" />
            <input type="number" data-testid="input-diastolic" placeholder="Diastolic" />
            <input type="number" data-testid="input-pulse" placeholder="Pulse" />
            <input data-testid="input-note" placeholder="Note (optional)" />
            <button type="submit" data-testid="submit-reading">Save</button>
          </form>
        </div>
      )}
      {route === "history" && (
        <div data-testid="history-page">
          <h2>Reading History</h2>
          <ul data-testid="readings-list" />
        </div>
      )}
      {route === "trends" && (
        <div data-testid="trends-page">
          <h2>Trends</h2>
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
