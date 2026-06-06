import React from "react";

export default function App() {
  return (
    <div>
      <h1>Meditation Timer</h1>
      <div data-testid="total-sessions">Total sessions: 0</div>
      <div data-testid="total-minutes">Total minutes: 0</div>
      <div data-testid="longest-session">Longest session: 0 min</div>
      <ul data-testid="session-list"></ul>
    </div>
  );
}
