"use client";
import React from "react";
export function PicksPage() {
  return (
    <div data-testid="picks-page">
      <h2>Make Pick</h2>
      <select data-testid="pick-team-select"><option value="">Select team</option></select>
      <select data-testid="pick-player-select"><option value="">Select player</option></select>
      <button data-testid="make-pick-btn">Make Pick</button>
      <div data-testid="available-count">0</div>
    </div>
  );
}
