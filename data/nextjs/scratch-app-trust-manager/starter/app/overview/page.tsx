import React from "react";

export function OverviewPage() {
  return (
    <div data-testid="overview-page">
      <h1>Trust Overview</h1>
      <div data-testid="total-principal">$0</div>
      <div data-testid="total-distributed">$0</div>
      <div data-testid="total-remaining">$0</div>
      <ul data-testid="trust-breakdown"></ul>
    </div>
  );
}
