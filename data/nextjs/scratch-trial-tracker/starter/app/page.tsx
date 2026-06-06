import React from "react";

export default function App() {
  return (
    <div>
      <h1>Trial Tracker</h1>
      <div data-testid="active-trials-count">0</div>
      <div data-testid="expired-trials-count">0</div>
      <div data-testid="converted-trials-count">0</div>
    </div>
  );
}
