import React from "react";

export function HomePage() {
  return (
    <div data-testid="home-page">
      <div data-testid="summary">
        <span data-testid="total-income">$0.00</span>
        <span data-testid="total-expenses">$0.00</span>
        <span data-testid="balance">$0.00</span>
      </div>
      <ul data-testid="recent-expenses"></ul>
      <ul data-testid="recent-incomes"></ul>
    </div>
  );
}
