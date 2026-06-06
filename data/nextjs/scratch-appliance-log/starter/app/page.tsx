import React from "react";

export default function App() {
  return (
    <div>
      <h1>Appliance Log</h1>
      <div data-testid="summary">
        <span data-testid="total-count"></span>
        <span data-testid="active-count"></span>
      </div>
      <div data-testid="appliance-list"></div>
    </div>
  );
}
