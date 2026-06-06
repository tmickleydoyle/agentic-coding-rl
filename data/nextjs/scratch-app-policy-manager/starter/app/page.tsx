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
          <h1>Policy Manager</h1>
          <div data-testid="stat-total">Total: 0</div>
          <div data-testid="stat-active">Active: 0</div>
          <div data-testid="stat-draft">Draft: 0</div>
          <div data-testid="stat-active-depts">Active Departments: 0</div>
        </div>
      )}
      {route.name === "list" && (
        <div data-testid="list-page">
          <h2>Policies</h2>
          <select data-testid="filter-department"><option value="All">All Departments</option></select>
          <select data-testid="filter-status"><option value="All">All</option></select>
          <button data-testid="add-policy-btn">Add Policy</button>
          <div data-testid="no-policies">No policies found</div>
        </div>
      )}
      {route.name === "add" && (
        <div data-testid="add-page">
          <h2>Add Policy</h2>
          <form data-testid="add-form">
            <input data-testid="input-title" />
            <select data-testid="input-department"><option value="IT">IT</option></select>
            <input data-testid="input-version" />
            <select data-testid="input-status"><option value="Draft">Draft</option></select>
            <input data-testid="input-owner" />
            <input data-testid="input-review-date" type="date" />
            <textarea data-testid="input-summary" />
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
