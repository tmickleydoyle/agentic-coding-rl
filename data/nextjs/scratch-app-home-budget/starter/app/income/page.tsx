import React from "react";

export function IncomePage() {
  return (
    <div data-testid="income-page">
      <div data-testid="add-income-form">
        <input data-testid="income-source" />
        <input data-testid="income-amount" type="number" />
        <input data-testid="income-date" type="date" />
        <button data-testid="add-income-btn">Add Income</button>
      </div>
      <ul data-testid="income-list"></ul>
    </div>
  );
}
