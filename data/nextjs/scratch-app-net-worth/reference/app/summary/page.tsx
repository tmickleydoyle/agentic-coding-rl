import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function SummaryPage() {
  const { assets, liabilities } = useApp();
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div data-testid="summary-page">
      <h1>Net Worth Summary</h1>
      <span data-testid="total-assets">${totalAssets.toFixed(2)}</span>
      <span data-testid="total-liabilities">${totalLiabilities.toFixed(2)}</span>
      <span data-testid="net-worth">${netWorth.toFixed(2)}</span>
    </div>
  );
}
