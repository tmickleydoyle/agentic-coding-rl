import React from "react";

export default function StatsPage() {
  return (
    <div data-testid="stats-page">
      <h1>Stats</h1>
      <p data-testid="stat-total-sessions">Total Sessions: 0</p>
      <p data-testid="stat-total-exercises">Total Exercises: 0</p>
      <p data-testid="stat-most-frequent">Most Frequent: N/A</p>
    </div>
  );
}
