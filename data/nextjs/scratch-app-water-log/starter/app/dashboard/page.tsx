import React from "react";

export function DashboardPage() {
  return (
    <div>
      <h1>Water Intake Dashboard</h1>
      <p data-testid="today-cups">0 cups</p>
      <p data-testid="daily-goal">8 cups goal</p>
      <p data-testid="cups-remaining">8 cups remaining</p>
      <p data-testid="progress-text">0% of daily goal</p>
    </div>
  );
}
