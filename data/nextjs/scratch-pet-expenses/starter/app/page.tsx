import React from "react";

export default function App() {
  return (
    <div>
      <h1>Pet Expense Tracker</h1>
      <div data-testid="pet-selector"></div>
      <div data-testid="pet-info">
        <span data-testid="pet-name"></span>
        <span data-testid="pet-species"></span>
      </div>
      <div data-testid="summary-section">
        <div data-testid="total-expenses"></div>
        <div data-testid="category-breakdown"></div>
      </div>
      <form data-testid="add-expense-form"></form>
    </div>
  );
}
