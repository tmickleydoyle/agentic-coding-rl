import React from "react";
export function DashboardPage() {
  return (
    <div data-testid="dashboard-page">
      <span data-testid="total-monthly">$0.00</span>
      <span data-testid="active-count">0</span>
      <span data-testid="due-soon-count">0</span>
      <ul data-testid="due-soon-list"></ul>
    </div>
  );
}
