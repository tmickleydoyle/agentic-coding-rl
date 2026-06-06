'use client';
import React from 'react';

export function RankingsPage() {
  return (
    <div data-testid="rankings-page">
      <h1>Rankings</h1>
      <select data-testid="game-filter">
        <option value="All">All</option>
        <option value="Chess">Chess</option>
        <option value="Trivia">Trivia</option>
        <option value="Puzzle">Puzzle</option>
        <option value="Racing">Racing</option>
      </select>
    </div>
  );
}
