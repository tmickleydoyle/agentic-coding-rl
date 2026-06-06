import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function PortfolioPage() {
  const { holdings } = useApp();
  const totalInvested = holdings.reduce((sum, h) => sum + h.shares * h.avgPrice, 0);
  const currentValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  const gainLoss = currentValue - totalInvested;

  return (
    <div data-testid="portfolio-page">
      <h1>Portfolio</h1>
      <span data-testid="total-invested">${totalInvested.toFixed(2)}</span>
      <span data-testid="current-value">${currentValue.toFixed(2)}</span>
      <span data-testid="gain-loss">${gainLoss.toFixed(2)}</span>
    </div>
  );
}
