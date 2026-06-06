import React from "react";

export default function App() {
  return (
    <div>
      <h1>Dog Training Tracker</h1>
      <div data-testid="dog-selector"></div>
      <div data-testid="dog-info"></div>
      <table data-testid="command-table"><thead></thead><tbody></tbody></table>
      <form data-testid="session-form"></form>
      <div data-testid="session-log"></div>
    </div>
  );
}
