import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function PerformancePage() {
  const { holdings } = useApp();
  return (
    <div data-testid="performance-page">
      <h1>Performance</h1>
      <ul data-testid="performance-list">
        {holdings.map((h) => {
          const gainPerShare = h.currentPrice - h.avgPrice;
          const gainPct = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
          const totalGain = gainPerShare * h.shares;
          return (
            <li key={h.id} data-testid={`perf-${h.id}`}>
              <span data-testid={`perf-ticker-${h.id}`}>{h.ticker}</span>
              <span data-testid={`perf-gain-per-share-${h.id}`}>${gainPerShare.toFixed(2)}</span>
              <span data-testid={`perf-gain-pct-${h.id}`}>{gainPct.toFixed(2)}%</span>
              <span data-testid={`perf-total-gain-${h.id}`}>${totalGain.toFixed(2)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
