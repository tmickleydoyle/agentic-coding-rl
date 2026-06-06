'use client'
import React from 'react';
export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1 data-testid="app-title">Tutor Sessions</h1>
      <p data-testid="total-sessions">Total: 0</p>
      <p data-testid="upcoming-sessions">Upcoming: 0</p>
      <button data-testid="btn-tutors">Browse Tutors</button>
      <button data-testid="btn-sessions">My Sessions</button>
    </div>
  );
}
