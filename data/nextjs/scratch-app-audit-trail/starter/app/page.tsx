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
          <h1>Audit Trail</h1>
          <div data-testid="stat-total">Total Events: 0</div>
          <div data-testid="stat-actors">Unique Actors: 0</div>
          <div data-testid="stat-create">CREATE: 0</div>
          <div data-testid="stat-update">UPDATE: 0</div>
          <div data-testid="stat-view">VIEW: 0</div>
          <div data-testid="stat-delete">DELETE: 0</div>
        </div>
      )}
      {route.name === "trail" && (
        <div data-testid="trail-page">
          <h2>Audit Trail</h2>
          <select data-testid="filter-actor"><option value="All">All Actors</option></select>
          <select data-testid="filter-action"><option value="All">All Actions</option></select>
          <div data-testid="no-events">No events found</div>
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
