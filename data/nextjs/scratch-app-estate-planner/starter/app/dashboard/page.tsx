import React from "react";

export function DashboardPage() {
  return (
    <div data-testid="dashboard-page">
      <h1>Estate Dashboard</h1>
      <div data-testid="total-value">$0</div>
      <div data-testid="asset-count">0 assets</div>
      <div data-testid="beneficiary-count">0 beneficiaries</div>
      <div data-testid="notes-preview"></div>
    </div>
  );
}
