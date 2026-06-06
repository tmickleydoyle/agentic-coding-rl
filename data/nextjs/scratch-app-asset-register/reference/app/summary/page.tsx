import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function SummaryPage() {
  const { assets, valuations } = useApp();

  const getLatest = (assetName: string) => {
    const relevant = valuations.filter((v) => v.assetName === assetName);
    if (relevant.length === 0) return null;
    return relevant.reduce((best, v) => (v.date > best.date ? v : best));
  };

  let totalValue = 0;
  assets.forEach((a) => {
    const latest = getLatest(a.name);
    if (latest) totalValue += latest.value;
  });

  return (
    <div data-testid="summary-page">
      <h1>Portfolio Summary</h1>
      <div data-testid="total-value">${totalValue.toLocaleString()}</div>
      <ul data-testid="asset-summary-list">
        {assets.map((a) => {
          const latest = getLatest(a.name);
          return (
            <li key={a.id} data-testid={`summary-item-${a.id}`}>
              <span data-testid={`summary-name-${a.id}`}>{a.name}</span>
              {latest ? (
                <>
                  <span data-testid={`summary-value-${a.id}`}>${latest.value.toLocaleString()}</span>
                  <span data-testid={`summary-date-${a.id}`}>{latest.date}</span>
                </>
              ) : (
                <span data-testid={`summary-no-val-${a.id}`}>No valuation</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
