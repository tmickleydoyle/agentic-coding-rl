"use client";
import React from "react";
export function FlagsPage() {
  return (
    <div data-testid="flags-page">
      <h2>Flags</h2>
      <select data-testid="flag-match-select"><option value="">Select match</option></select>
      <input data-testid="flag-minute-input" type="number" placeholder="Minute" />
      <select data-testid="flag-type-select">
        <option value="foul">Foul</option>
        <option value="yellow">Yellow</option>
        <option value="red">Red</option>
        <option value="offside">Offside</option>
      </select>
      <input data-testid="flag-note-input" placeholder="Note" />
      <button data-testid="add-flag-btn">Add Flag</button>
      <ul data-testid="flag-list"></ul>
    </div>
  );
}
