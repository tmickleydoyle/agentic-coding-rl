'use client'
import React from 'react';

export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1 data-testid="class-name"></h1>
      <p data-testid="teacher"></p>
      <p data-testid="room"></p>
      <p data-testid="period"></p>
      <button data-testid="btn-roster">View Roster</button>
      <button data-testid="btn-schedule">View Schedule</button>
    </div>
  );
}
