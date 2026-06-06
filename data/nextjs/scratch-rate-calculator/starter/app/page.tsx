"use client";
import React from "react";

export default function App() {
  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1 data-testid="page-heading">Rate Calculator</h1>
      <div data-testid="results-panel" />
    </main>
  );
}
