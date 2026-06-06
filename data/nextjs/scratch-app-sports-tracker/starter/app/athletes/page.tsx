"use client";
import React from "react";

export function AthletesPage() {
  return (
    <div data-testid="athletes-page">
      <h2>Athletes</h2>
      <input data-testid="athlete-name-input" placeholder="Name" />
      <input data-testid="athlete-sport-input" placeholder="Sport" />
      <input data-testid="athlete-position-input" placeholder="Position" />
      <button data-testid="add-athlete-btn">Add Athlete</button>
      <ul data-testid="athlete-list"></ul>
    </div>
  );
}
