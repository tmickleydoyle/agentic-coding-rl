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
          <h1>Allergy Log</h1>
          <p data-testid="allergy-count">Total allergies: 0</p>
          <p data-testid="reaction-count">Total reactions: 0</p>
          <p data-testid="severe-count">Severe allergies: 0</p>
          <div data-testid="allergy-list" />
          <button data-testid="go-add">Add Allergy</button>
        </div>
      )}
      {route === "add" && (
        <div data-testid="add-page">
          <h2>Add Allergy</h2>
          <form data-testid="add-form">
            <input data-testid="input-name" placeholder="Allergen name" />
            <select data-testid="input-type">
              <option value="food">Food</option>
              <option value="medication">Medication</option>
              <option value="environmental">Environmental</option>
              <option value="insect">Insect</option>
              <option value="other">Other</option>
            </select>
            <select data-testid="input-severity">
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
            <input data-testid="input-symptoms" placeholder="Symptoms (comma separated)" />
            <textarea data-testid="input-notes" placeholder="Notes" />
            <button type="submit" data-testid="submit-allergy">Add</button>
          </form>
        </div>
      )}
      {route === "reactions" && (
        <div data-testid="reactions-page">
          <h2>Reactions</h2>
          <form data-testid="reaction-form">
            <select data-testid="input-allergy-id"><option value="">Select allergy...</option></select>
            <input type="date" data-testid="input-reaction-date" />
            <input data-testid="input-reaction-symptoms" placeholder="Symptoms" />
            <select data-testid="input-reaction-severity">
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
            <input data-testid="input-treatment" placeholder="Treatment" />
            <button type="submit" data-testid="submit-reaction">Log Reaction</button>
          </form>
          <ul data-testid="reactions-list" />
        </div>
      )}
      {route === "triggers" && (
        <div data-testid="triggers-page">
          <h2>Top Triggers</h2>
          <ul data-testid="triggers-list" />
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
