"use client";
import React from "react";
export function PlayersPage() {
  return (
    <div data-testid="players-page">
      <h2>Players</h2>
      <input data-testid="player-name-input" placeholder="Name" />
      <input data-testid="player-number-input" type="number" placeholder="Number" />
      <input data-testid="player-position-input" placeholder="Position" />
      <button data-testid="add-player-btn">Add Player</button>
      <ul data-testid="player-list"></ul>
    </div>
  );
}
