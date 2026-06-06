"use client";
import { useState } from "react";

export default function App() {
  const [_unused] = useState(null);
  return (
    <main>
      <h1>Chapter Notes</h1>
      <div data-testid="add-form"></div>
      <div data-testid="filter-section"></div>
      <ul data-testid="note-list"></ul>
    </main>
  );
}
