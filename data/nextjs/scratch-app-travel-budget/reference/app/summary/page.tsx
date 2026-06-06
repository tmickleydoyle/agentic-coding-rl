import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function SummaryPage() {
  const { expenses } = useApp();
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  const catMap: Record<string, number> = {};
  expenses.forEach((e) => {
    catMap[e.category] = (catMap[e.category] ?? 0) + e.amount;
  });

  const rows = Object.keys(catMap)
    .sort((a, b) => catMap[b] - catMap[a])
    .map((cat) => ({ cat, amount: catMap[cat], percent: totalSpent === 0 ? "0.0%" : ((catMap[cat] / totalSpent) * 100).toFixed(1) + "%" }));

  return (
    <div data-testid="summary-page">
      <h2>Spending Summary</h2>
      {rows.map((row) => (
        <div key={row.cat} data-testid="summary-row">
          <span data-testid="summary-category">{row.cat}</span>
          <span data-testid="summary-amount">{row.amount}</span>
          <span data-testid="summary-percent">{row.percent}</span>
        </div>
      ))}
    </div>
  );
}
