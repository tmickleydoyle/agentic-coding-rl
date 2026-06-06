"use client";
import React from "react";
export function MatchesPage() {
  return (
    <div data-testid="matches-page">
      <h2>Matches</h2>
      <input data-testid="match-home-input" placeholder="Home Team" />
      <input data-testid="match-away-input" placeholder="Away Team" />
      <input data-testid="match-date-input" type="date" />
      <input data-testid="match-venue-input" placeholder="Venue" />
      <button data-testid="add-match-btn">Add Match</button>
      <ul data-testid="match-list"></ul>
    </div>
  );
}
