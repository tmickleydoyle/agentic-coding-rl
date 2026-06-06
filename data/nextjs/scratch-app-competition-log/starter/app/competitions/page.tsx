import React from "react";

export default function CompetitionsPage() {
  return (
    <div data-testid="competitions-page">
      <h1>Competitions</h1>
      <form data-testid="add-competition-form">
        <input data-testid="input-comp-name" placeholder="Name" />
        <input data-testid="input-comp-sport" placeholder="Sport" />
        <input data-testid="input-comp-date" type="date" />
        <input data-testid="input-comp-location" placeholder="Location" />
        <button type="submit" data-testid="btn-add-competition">Add</button>
      </form>
      <ul data-testid="competitions-list"></ul>
    </div>
  );
}
