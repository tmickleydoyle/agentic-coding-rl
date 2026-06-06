import React from "react";

export default function App() {
  return (
    <div>
      <h1>Warranty Tracker</h1>
      <div data-testid="summary">
        <span data-testid="total-count"></span>
        <span data-testid="expired-count"></span>
      </div>
      <div data-testid="warranty-list"></div>
    </div>
  );
}
