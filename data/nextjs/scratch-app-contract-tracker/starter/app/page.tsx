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
          <h1>Contract Tracker</h1>
          <div data-testid="stat-total">Total Contracts: 0</div>
          <div data-testid="stat-active-value">Active Value: 0</div>
          <div data-testid="stat-active-count">Active: 0</div>
          <div data-testid="stat-expired-count">Expired: 0</div>
          <button data-testid="go-to-contracts">View Contracts</button>
        </div>
      )}
      {route.name === "list" && (
        <div data-testid="list-page">
          <h2>Contracts</h2>
          <select data-testid="filter-status"><option value="All">All</option></select>
          <button data-testid="add-contract-btn">Add Contract</button>
          <div data-testid="no-contracts">No contracts found</div>
        </div>
      )}
      {route.name === "add" && (
        <div data-testid="add-page">
          <h2>Add Contract</h2>
          <form data-testid="add-form">
            <input data-testid="input-title" />
            <input data-testid="input-party" />
            <input data-testid="input-value" type="number" />
            <input data-testid="input-start-date" type="date" />
            <input data-testid="input-end-date" type="date" />
            <select data-testid="input-status"><option value="Active">Active</option></select>
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
