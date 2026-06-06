import React from "react";

export default function App() {
  return (
    <div>
      <h1>Repair History</h1>
      <div data-testid="summary">
        <span data-testid="total-count"></span>
        <span data-testid="total-cost"></span>
      </div>
      <div data-testid="repair-list"></div>
    </div>
  );
}
