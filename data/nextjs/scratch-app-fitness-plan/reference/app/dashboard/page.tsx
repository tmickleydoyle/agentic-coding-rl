import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function DashboardPage() {
  const { workouts } = useApp();
  const total = workouts.length;
  const totalMinutes = workouts.reduce((s, w) => s + w.duration, 0);
  const completed = workouts.filter((w) => w.completed).length;

  return (
    <div data-testid="dashboard-page">
      <h1>Dashboard</h1>
      <p data-testid="stat-total-workouts">Total Workouts: {total}</p>
      <p data-testid="stat-total-minutes">Total Minutes: {totalMinutes}</p>
      <p data-testid="stat-completed">Completed: {completed}</p>
    </div>
  );
}
