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
          <h1>Sign-off Tracker</h1>
          <div data-testid="stat-total">Total: 0</div>
          <div data-testid="stat-complete">Complete: 0</div>
          <div data-testid="stat-in-progress">In Progress: 0</div>
          <div data-testid="stat-pending">Pending: 0</div>
        </div>
      )}
      {route.name === "list" && (
        <div data-testid="list-page">
          <h2>Sign-offs</h2>
          <select data-testid="filter-status"><option value="All">All</option></select>
          <button data-testid="add-signoff-btn">New Sign-off</button>
          <div data-testid="no-items">No sign-off items found</div>
        </div>
      )}
      {route.name === "add" && (
        <div data-testid="add-page">
          <h2>New Sign-off</h2>
          <form data-testid="add-form">
            <input data-testid="input-title" />
            <textarea data-testid="input-signers" />
            <input data-testid="input-due-date" type="date" />
            <button type="submit" data-testid="submit-btn">Create</button>
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
