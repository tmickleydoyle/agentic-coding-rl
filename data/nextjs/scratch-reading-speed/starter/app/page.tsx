"use client";
import { useState } from "react";

export default function App() {
  const [_unused] = useState(null);
  return (
    <main>
      <h1>Reading Speed Tracker</h1>
      <div data-testid="stats-panel"></div>
      <div data-testid="add-form"></div>
      <ul data-testid="session-list"></ul>
    </main>
  );
}
