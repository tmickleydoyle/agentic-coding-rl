import React from "react";
export function HoldingsPage() {
  return (
    <div data-testid="holdings-page">
      <div data-testid="add-holding-form">
        <input data-testid="holding-ticker" /><input data-testid="holding-shares" type="number" />
        <input data-testid="holding-avg-price" type="number" /><input data-testid="holding-current-price" type="number" />
        <button data-testid="add-holding-btn">Add Holding</button>
      </div>
      <ul data-testid="holding-list"></ul>
    </div>
  );
}
