'use client';
import React from 'react';
export function StatsPage() {
  return <div><h2>Stats</h2>
    <div data-testid="stats-week-count">0</div>
    <ul data-testid="stats-methods-list"></ul>
    <ul data-testid="stats-bean-ratings-list"></ul>
  </div>;
}
