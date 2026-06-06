"use client";
import React from "react";
export function GamesPage() {
  return (
    <div data-testid="games-page">
      <h2>Games</h2>
      <input data-testid="game-title-input" placeholder="Title" />
      <input data-testid="game-date-input" type="date" />
      <input data-testid="game-opponent-input" placeholder="Opponent" />
      <input data-testid="game-our-score-input" type="number" placeholder="Our Score" />
      <input data-testid="game-their-score-input" type="number" placeholder="Their Score" />
      <button data-testid="add-game-btn">Add Game</button>
      <ul data-testid="game-list"></ul>
    </div>
  );
}
