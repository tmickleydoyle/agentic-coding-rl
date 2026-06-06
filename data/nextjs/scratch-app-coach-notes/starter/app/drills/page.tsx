import React from "react";

export default function DrillsPage() {
  return (
    <div data-testid="drills-page">
      <h1>Drills</h1>
      <p data-testid="no-active-session">No active session</p>
      <ul data-testid="sessions-list"></ul>
    </div>
  );
}
