import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function OverviewPage() {
  const { documents, deductions } = useApp();
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
  return (
    <div data-testid="overview-page">
      <h1>Tax Overview</h1>
      <span data-testid="total-deductions">${totalDeductions.toFixed(2)}</span>
      <span data-testid="doc-count">{documents.length}</span>
      <span data-testid="tax-year">2023</span>
    </div>
  );
}
