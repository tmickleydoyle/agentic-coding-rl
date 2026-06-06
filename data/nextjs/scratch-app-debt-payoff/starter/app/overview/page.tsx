import React from "react";
export function OverviewPage() {
  return (
    <div data-testid="overview-page">
      <span data-testid="total-remaining">$0.00</span>
      <span data-testid="total-paid">$0.00</span>
      <span data-testid="debt-count">0</span>
    </div>
  );
}
