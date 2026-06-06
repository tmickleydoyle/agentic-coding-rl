"use client";
import { useState } from "react";

export default function App() {
  const [_unused] = useState(null);
  return (
    <main>
      <h1>Book Summary Log</h1>
      <div data-testid="add-form"></div>
      <div data-testid="filter-section"></div>
      <ul data-testid="book-list"></ul>
    </main>
  );
}
