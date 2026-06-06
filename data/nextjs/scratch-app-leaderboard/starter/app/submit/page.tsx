'use client';
import React from 'react';

export function SubmitPage() {
  return (
    <div data-testid="submit-page">
      <h1>Submit Score</h1>
      <input data-testid="player-input" placeholder="Player name" />
      <select data-testid="game-select">
        <option value="Chess">Chess</option>
        <option value="Trivia">Trivia</option>
        <option value="Puzzle">Puzzle</option>
        <option value="Racing">Racing</option>
      </select>
      <input data-testid="score-input" type="number" placeholder="Score" />
      <button data-testid="submit-btn">Submit</button>
    </div>
  );
}
