import React from "react";

export function SummaryPage() {
  return (
    <div data-testid="summary-page">
      <h1>Portfolio Summary</h1>
      <div data-testid="total-value">$0</div>
      <ul data-testid="asset-summary-list"></ul>
    </div>
  );
}
