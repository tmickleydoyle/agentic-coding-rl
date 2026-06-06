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
          <h1>Medication Tracker</h1>
          <p data-testid="med-count">Active medications: 0</p>
          <p data-testid="dose-count">Doses logged: 0</p>
          <div data-testid="active-meds" />
          <button data-testid="go-add">Add Medication</button>
        </div>
      )}
      {route === "add" && (
        <div data-testid="add-page">
          <h2>Add Medication</h2>
          <form data-testid="add-form">
            <input data-testid="input-name" placeholder="Medication name" />
            <input data-testid="input-dosage" placeholder="Dosage (e.g. 10mg)" />
            <select data-testid="input-frequency">
              <option value="daily">Daily</option>
              <option value="twice-daily">Twice Daily</option>
              <option value="weekly">Weekly</option>
              <option value="as-needed">As Needed</option>
            </select>
            <input data-testid="input-instructions" placeholder="Instructions" />
            <button type="submit" data-testid="submit-med">Add</button>
          </form>
        </div>
      )}
      {route === "schedule" && (
        <div data-testid="schedule-page">
          <h2>Medication Schedule</h2>
          <ul data-testid="meds-list" />
        </div>
      )}
      {route === "log" && (
        <div data-testid="log-page">
          <h2>Dose Log</h2>
          <ul data-testid="dose-logs-list" />
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
