'use client';
import React from 'react';

export function StatsPage() {
  return (
    <div>
      <h2>Stats</h2>
      <div data-testid="stats-total-cost">0.00</div>
      <ul data-testid="stats-category-list"></ul>
    </div>
  );
}
