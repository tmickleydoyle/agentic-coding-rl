import React from "react";

export function ReportsPage() {
  return (
    <div data-testid="reports-page">
      <div data-testid="report-summary">
        <span data-testid="report-total-income">$0.00</span>
        <span data-testid="report-total-expenses">$0.00</span>
        <span data-testid="report-balance">$0.00</span>
      </div>
      <ul data-testid="category-breakdown"></ul>
    </div>
  );
}
