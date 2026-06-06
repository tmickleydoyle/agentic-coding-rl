'use client';
import React from 'react';

export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1>Leaderboard</h1>
      <div data-testid="stat-scores">Scores: 0</div>
      <div data-testid="stat-players">Players: 0</div>
      <div data-testid="stat-top">None</div>
    </div>
  );
}
