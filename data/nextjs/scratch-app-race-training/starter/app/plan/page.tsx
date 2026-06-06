import React from "react";

export default function PlanPage() {
  return (
    <div data-testid="plan-page">
      <h1>Race Plan</h1>
      <p data-testid="race-name">City Marathon</p>
      <p data-testid="race-distance">42.2km</p>
      <p data-testid="race-date">2024-10-15</p>
      <p data-testid="plan-total-runs">Total Runs: 0</p>
      <p data-testid="plan-completed-runs">Completed: 0</p>
    </div>
  );
}
