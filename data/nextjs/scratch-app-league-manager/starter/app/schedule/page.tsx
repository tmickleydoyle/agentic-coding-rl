"use client";
import React from "react";
export function SchedulePage() {
  return (
    <div data-testid="schedule-page">
      <h2>Schedule</h2>
      <select data-testid="match-home-select"><option value="">Home Team</option></select>
      <select data-testid="match-away-select"><option value="">Away Team</option></select>
      <input data-testid="match-date-input" type="date" />
      <input data-testid="match-home-score-input" type="number" placeholder="Home Score" />
      <input data-testid="match-away-score-input" type="number" placeholder="Away Score" />
      <button data-testid="add-match-btn">Add Match</button>
      <ul data-testid="match-list"></ul>
    </div>
  );
}
