import React from "react";

export default function App() {
  return (
    <div>
      <h1>Home Inventory</h1>
      <div data-testid="summary">
        <span data-testid="total-count"></span>
        <span data-testid="total-value"></span>
      </div>
      <div data-testid="item-list"></div>
    </div>
  );
}
