import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function DashboardPage() {
  const { goals, contributions } = useApp();
  const totalSaved = contributions.reduce((sum, c) => sum + c.amount, 0);
  const sorted = [...contributions].sort((a, b) => b.date.localeCompare(a.date));
  const recent = sorted[0] || null;

  return (
    <div data-testid="dashboard-page">
      <h1>Savings Dashboard</h1>
      <span data-testid="total-saved">${totalSaved.toFixed(2)}</span>
      <span data-testid="active-goals">{goals.length}</span>
      {recent && (
        <div data-testid="recent-contribution">
          <span data-testid="recent-contribution-amount">${recent.amount.toFixed(2)}</span>
          <span data-testid="recent-contribution-date">{recent.date}</span>
        </div>
      )}
    </div>
  );
}
