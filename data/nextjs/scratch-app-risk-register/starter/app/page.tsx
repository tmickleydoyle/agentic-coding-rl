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
          <h1>Risk Register</h1>
          <div data-testid="stat-total">Total Risks: 0</div>
          <div data-testid="stat-open">Open: 0</div>
          <div data-testid="stat-avg-score">Avg Open Score: 0.0</div>
          <div data-testid="stat-highest">None</div>
        </div>
      )}
      {route.name === "list" && (
        <div data-testid="list-page">
          <h2>Risks</h2>
          <select data-testid="filter-category"><option value="All">All Categories</option></select>
          <select data-testid="filter-status"><option value="All">All</option></select>
          <button data-testid="add-risk-btn">Add Risk</button>
          <div data-testid="no-risks">No risks found</div>
        </div>
      )}
      {route.name === "add" && (
        <div data-testid="add-page">
          <h2>Add Risk</h2>
          <form data-testid="add-form">
            <input data-testid="input-title" />
            <select data-testid="input-category"><option value="Security">Security</option></select>
            <input data-testid="input-likelihood" type="number" defaultValue={3} />
            <input data-testid="input-impact" type="number" defaultValue={3} />
            <select data-testid="input-status"><option value="Open">Open</option></select>
            <input data-testid="input-owner" />
            <textarea data-testid="input-description" />
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
