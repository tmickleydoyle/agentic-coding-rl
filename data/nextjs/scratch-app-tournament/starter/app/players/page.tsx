"use client";
import React from "react";
export function PlayersPage() {
  return (
    <div data-testid="players-page">
      <h2>Players</h2>
      <input data-testid="player-name-input" placeholder="Name" />
      <input data-testid="player-seed-input" type="number" placeholder="Seed" />
      <input data-testid="player-country-input" placeholder="Country" />
      <button data-testid="add-player-btn">Add Player</button>
      <ul data-testid="player-list"></ul>
    </div>
  );
}
