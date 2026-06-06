import React from "react";

export default function App() {
  return (
    <div>
      <h1>Pet Weight Tracker</h1>
      <div data-testid="pet-selector"></div>
      <div data-testid="pet-info">
        <span data-testid="pet-name"></span>
        <span data-testid="pet-species"></span>
      </div>
      <div data-testid="trend-summary-section">
        <span data-testid="latest-weight"></span>
        <span data-testid="trend-summary"></span>
      </div>
      <form data-testid="add-weight-form"></form>
    </div>
  );
}
