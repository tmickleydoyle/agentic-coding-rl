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
          <h1>Approval Flow</h1>
          <div data-testid="stat-total">Total: 0</div>
          <div data-testid="stat-pending">Pending: 0</div>
          <div data-testid="stat-approved">Approved: 0</div>
          <div data-testid="stat-rejected">Rejected: 0</div>
          <div data-testid="stat-approved-amount">Approved Amount: 0</div>
        </div>
      )}
      {route.name === "list" && (
        <div data-testid="list-page">
          <h2>Approval Requests</h2>
          <select data-testid="filter-type"><option value="All">All Types</option></select>
          <select data-testid="filter-status"><option value="All">All</option></select>
          <button data-testid="add-request-btn">New Request</button>
          <div data-testid="no-requests">No requests found</div>
        </div>
      )}
      {route.name === "add" && (
        <div data-testid="add-page">
          <h2>New Request</h2>
          <form data-testid="add-form">
            <input data-testid="input-title" />
            <input data-testid="input-submitter" />
            <select data-testid="input-type"><option value="Budget">Budget</option></select>
            <input data-testid="input-amount" type="number" />
            <button type="submit" data-testid="submit-btn">Submit</button>
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
