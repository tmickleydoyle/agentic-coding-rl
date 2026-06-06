'use client'
import React from 'react';

export function StatsPage() {
  return (
    <main data-testid="stats-page">
      <h2>Statistics</h2>
      <p data-testid="total-sessions">0 total sessions</p>
      <p data-testid="longest-session">0 min longest session</p>
      <ul data-testid="stats-by-subject" />
    </main>
  );
}
