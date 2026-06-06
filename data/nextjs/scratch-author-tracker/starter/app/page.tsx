"use client";
import { useState } from "react";

export default function App() {
  const [_unused] = useState(null);
  return (
    <main>
      <h1>Author Tracker</h1>
      <div data-testid="stats"></div>
      <div data-testid="add-form"></div>
      <div data-testid="filter-section"></div>
      <ul data-testid="author-list"></ul>
    </main>
  );
}
