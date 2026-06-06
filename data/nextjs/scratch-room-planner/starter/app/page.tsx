import React from "react";

export default function App() {
  return (
    <div>
      <h1>Room Planner</h1>
      <div data-testid="summary">
        <span data-testid="total-count"></span>
        <span data-testid="total-area"></span>
      </div>
      <div data-testid="room-list"></div>
    </div>
  );
}
