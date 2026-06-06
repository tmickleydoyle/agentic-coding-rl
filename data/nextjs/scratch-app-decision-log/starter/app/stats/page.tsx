import React from "react";
export function StatsPage() {
  return (
    <div data-testid="stats-page">
      <h1>Decision Statistics</h1>
      <ul data-testid="stats-list">
        <li data-testid="stat-pending">Pending: <span data-testid="stat-pending-count">0</span></li>
        <li data-testid="stat-decided">Decided: <span data-testid="stat-decided-count">0</span></li>
        <li data-testid="stat-revisited">Revisited: <span data-testid="stat-revisited-count">0</span></li>
      </ul>
      <p data-testid="stat-total">Total: 0</p>
    </div>
  );
}
