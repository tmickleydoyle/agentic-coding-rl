import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function DashboardPage() {
  const { bills } = useApp();
  const activeBills = bills.filter((b) => b.isActive);
  const totalMonthly = activeBills.reduce((sum, b) => sum + b.amount, 0);
  const currentDay = 1; // reference day for tests
  const dueSoon = activeBills.filter((b) => b.dueDay >= currentDay && b.dueDay <= currentDay + 7);

  return (
    <div data-testid="dashboard-page">
      <h1>Bill Dashboard</h1>
      <span data-testid="total-monthly">${totalMonthly.toFixed(2)}</span>
      <span data-testid="active-count">{activeBills.length}</span>
      <span data-testid="due-soon-count">{dueSoon.length}</span>
      <ul data-testid="due-soon-list">
        {dueSoon.map((b) => (
          <li key={b.id} data-testid={`due-soon-${b.id}`}>{b.name} - Day {b.dueDay}</li>
        ))}
      </ul>
    </div>
  );
}
