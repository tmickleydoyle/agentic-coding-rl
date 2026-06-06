"use client";
import React from "react";

export default function App() {
  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1 data-testid="page-heading">Invoice Log</h1>
      <div data-testid="invoice-list" />
    </main>
  );
}
