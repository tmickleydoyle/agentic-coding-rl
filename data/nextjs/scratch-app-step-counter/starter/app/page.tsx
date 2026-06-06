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
          <h1>Step Counter</h1>
          <p data-testid="daily-goal">Daily goal: 10000</p>
          <p data-testid="total-steps">Total steps: 0</p>
          <p data-testid="goal-met-days">Days goal met: 0</p>
          <p data-testid="no-today">No steps logged today.</p>
          <button data-testid="go-log">Log Steps</button>
        </div>
      )}
      {route === "log" && (
        <div data-testid="log-page">
          <h2>Log Steps</h2>
          <form data-testid="log-form">
            <input type="date" data-testid="input-date" />
            <input type="number" data-testid="input-steps" placeholder="Steps" />
            <input data-testid="input-notes" placeholder="Notes (optional)" />
            <button type="submit" data-testid="submit-log">Save</button>
          </form>
        </div>
      )}
      {route === "history" && (
        <div data-testid="history-page">
          <h2>Step History</h2>
          <ul data-testid="entries-list" />
        </div>
      )}
      {route === "goals" && (
        <div data-testid="goals-page">
          <h2>Step Goals</h2>
          <p data-testid="current-goal">Current goal: 10000 steps/day</p>
          <form data-testid="goal-form">
            <input type="number" data-testid="input-target" placeholder="Daily step target" />
            <button type="submit" data-testid="save-goal">Save Goal</button>
          </form>
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
