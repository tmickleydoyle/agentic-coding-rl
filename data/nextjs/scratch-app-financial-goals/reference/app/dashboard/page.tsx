import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function DashboardPage() {
  const { goals } = useApp();
  const completed = goals.filter((g) => g.status === "completed").length;
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);

  return (
    <div data-testid="dashboard-page">
      <h1>Financial Goals Dashboard</h1>
      <span data-testid="total-goals">{goals.length}</span>
      <span data-testid="completed-goals">{completed}</span>
      <span data-testid="total-target">${totalTarget.toFixed(2)}</span>
      <span data-testid="total-saved">${totalSaved.toFixed(2)}</span>
    </div>
  );
}
