import React from "react";

export default function DashboardPage() {
  return (
    <div data-testid="dashboard-page">
      <h1>Dashboard</h1>
      <p data-testid="stat-total-workouts">Total Workouts: 0</p>
      <p data-testid="stat-total-minutes">Total Minutes: 0</p>
      <p data-testid="stat-completed">Completed: 0</p>
    </div>
  );
}
