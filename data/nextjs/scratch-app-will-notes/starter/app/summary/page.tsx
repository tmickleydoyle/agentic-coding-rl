import React from "react";

export function SummaryPage() {
  return (
    <div data-testid="summary-page">
      <h1>Will Summary</h1>
      <div data-testid="clause-count">0 clauses</div>
      <div data-testid="signed-count">0 signed</div>
      <div data-testid="pending-count">0 pending</div>
    </div>
  );
}
