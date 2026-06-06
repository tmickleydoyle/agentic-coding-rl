import React from "react";

export default function App() {
  return (
    <div>
      <h1>Stretch Routine Log</h1>
      <div data-testid="total-sessions">Total sessions: 0</div>
      <div data-testid="total-minutes">Total minutes: 0</div>
      <div data-testid="total-stretches">Total stretches: 0</div>
      <ul data-testid="session-list"></ul>
    </div>
  );
}
