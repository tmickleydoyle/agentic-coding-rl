import React from "react";
export function SummaryPage() {
  return (
    <div data-testid="summary-page">
      <span data-testid="total-assets">$0.00</span>
      <span data-testid="total-liabilities">$0.00</span>
      <span data-testid="net-worth">$0.00</span>
    </div>
  );
}
