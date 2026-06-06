import React from "react";

export default function StatsPage() {
  return (
    <div data-testid="stats-page">
      <p data-testid="stat-total-entries">0</p>
      <p data-testid="stat-countries"></p>
      <p data-testid="stat-avg-rating">N/A</p>
      <p data-testid="stat-top-mood">N/A</p>
    </div>
  );
}
