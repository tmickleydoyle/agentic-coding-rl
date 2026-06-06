'use client';
import React from 'react';

export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1>Voting Board</h1>
      <div data-testid="stat-proposals">Proposals: 0</div>
      <div data-testid="stat-votes">Votes: 0</div>
      <div data-testid="stat-top">None</div>
    </div>
  );
}
