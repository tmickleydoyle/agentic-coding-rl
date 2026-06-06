import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route.name === "dashboard" && (
        <div data-testid="dashboard-page">
          <h1>Compliance Log</h1>
          <div data-testid="stat-total">Total: 0</div>
          <div data-testid="stat-open">Open: 0</div>
          <div data-testid="stat-resolved">Resolved: 0</div>
          <div data-testid="stat-critical">Critical: 0</div>
        </div>
      )}
      {route.name === "list" && (
        <div data-testid="list-page">
          <h2>Compliance Logs</h2>
          <select data-testid="filter-regulation"><option value="All">All Regulations</option></select>
          <select data-testid="filter-severity"><option value="All">All Severities</option></select>
          <button data-testid="add-log-btn">Add Entry</button>
          <div data-testid="no-logs">No log entries found</div>
        </div>
      )}
      {route.name === "add" && (
        <div data-testid="add-page">
          <h2>Add Compliance Entry</h2>
          <form data-testid="add-form">
            <input data-testid="input-title" />
            <select data-testid="input-regulation"><option value="GDPR">GDPR</option></select>
            <select data-testid="input-severity"><option value="Medium">Medium</option></select>
            <select data-testid="input-status"><option value="Open">Open</option></select>
            <input data-testid="input-date" type="date" />
            <textarea data-testid="input-notes" />
            <button type="submit" data-testid="submit-btn">Save</button>
            <button type="button" data-testid="cancel-btn">Cancel</button>
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
