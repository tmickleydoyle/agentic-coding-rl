import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function DashboardPage() {
  const { assets, beneficiaries, notes } = useApp();
  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
  return (
    <div data-testid="dashboard-page">
      <h1>Estate Dashboard</h1>
      <div data-testid="total-value">${totalValue.toLocaleString()}</div>
      <div data-testid="asset-count">{assets.length} assets</div>
      <div data-testid="beneficiary-count">{beneficiaries.length} beneficiaries</div>
      <div data-testid="notes-preview">{notes.slice(0, 100)}</div>
    </div>
  );
}
