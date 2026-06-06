import React from "react";
export function DebtsPage() {
  return (
    <div data-testid="debts-page">
      <div data-testid="add-debt-form">
        <input data-testid="debt-name" /><input data-testid="debt-balance" type="number" />
        <input data-testid="debt-interest" type="number" /><input data-testid="debt-minimum" type="number" />
        <button data-testid="add-debt-btn">Add Debt</button>
      </div>
      <ul data-testid="debt-list"></ul>
    </div>
  );
}
