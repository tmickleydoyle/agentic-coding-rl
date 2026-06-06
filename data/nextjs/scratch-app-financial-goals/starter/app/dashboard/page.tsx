import React from "react";
export function DashboardPage() {
  return (
    <div data-testid="dashboard-page">
      <span data-testid="total-goals">0</span>
      <span data-testid="completed-goals">0</span>
      <span data-testid="total-target">$0.00</span>
      <span data-testid="total-saved">$0.00</span>
    </div>
  );
}
