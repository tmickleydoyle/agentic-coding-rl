import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function DashboardPage() {
  const { todayTotal, dailyGoal } = useApp();
  const remaining = Math.max(0, dailyGoal - todayTotal);
  const percent = Math.min(100, Math.round((todayTotal / dailyGoal) * 100));
  return (
    <div>
      <h1>Water Intake Dashboard</h1>
      <p data-testid="today-cups">{todayTotal} cups</p>
      <p data-testid="daily-goal">{dailyGoal} cups goal</p>
      <p data-testid="cups-remaining">{remaining} cups remaining</p>
      <p data-testid="progress-text">{percent}% of daily goal</p>
    </div>
  );
}
