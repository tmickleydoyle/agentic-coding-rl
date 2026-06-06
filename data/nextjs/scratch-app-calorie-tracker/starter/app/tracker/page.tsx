import React from "react";

export function TrackerPage() {
  return (
    <div>
      <h1>Calorie Tracker</h1>
      <p data-testid="calories-consumed">0</p>
      <p data-testid="calories-goal">2000</p>
      <p data-testid="calories-remaining">2000</p>
      <p data-testid="progress-percent">0%</p>
    </div>
  );
}
