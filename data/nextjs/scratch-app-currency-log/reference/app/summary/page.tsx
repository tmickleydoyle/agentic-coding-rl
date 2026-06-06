import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function SummaryPage() {
  const { exchanges } = useApp();
  const totals: Record<string, number> = {};
  exchanges.forEach((e) => {
    totals[e.toCurrency] = (totals[e.toCurrency] ?? 0) + e.amountTo;
  });
  const rows = Object.keys(totals).sort();

  return (
    <div data-testid="summary-page">
      <h2>Currency Summary</h2>
      {rows.map((currency) => (
        <div key={currency} data-testid="summary-row">
          <span data-testid="summary-currency">{currency}</span>
          <span data-testid="summary-total">{totals[currency]}</span>
        </div>
      ))}
    </div>
  );
}
