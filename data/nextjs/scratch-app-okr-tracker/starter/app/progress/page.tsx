import React from "react";
export function ProgressPage() {
  return (
    <div data-testid="progress-page">
      <h1>OKR Progress</h1>
      <p data-testid="total-objectives">Total Objectives: 0</p>
      <p data-testid="avg-progress">Average KR Progress: 0%</p>
      <ul data-testid="status-breakdown">
        <li data-testid="status-on-track">On Track: <span data-testid="count-on-track">0</span></li>
        <li data-testid="status-at-risk">At Risk: <span data-testid="count-at-risk">0</span></li>
        <li data-testid="status-behind">Behind: <span data-testid="count-behind">0</span></li>
        <li data-testid="status-completed">Completed: <span data-testid="count-completed">0</span></li>
      </ul>
    </div>
  );
}
