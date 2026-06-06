"use client";
import { useState } from "react";

export default function App() {
  const [_unused] = useState(null);
  return (
    <main>
      <h1>Library Wishlist</h1>
      <div data-testid="add-form"></div>
      <div data-testid="controls"></div>
      <ul data-testid="wishlist"></ul>
    </main>
  );
}
