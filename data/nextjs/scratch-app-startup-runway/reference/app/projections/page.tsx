import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ProjectionsPage() {
  const { expenses, settings } = useApp();
  const monthlyBurn = expenses.reduce((s, e) => s + e.amount, 0);

  const rows = [];
  for (let i = 1; i <= 12; i++) {
    const startCash = settings.cashBalance - monthlyBurn * (i - 1);
    const endCash = startCash - monthlyBurn;
    rows.push({ month: i, startCash, burn: monthlyBurn, endCash });
  }

  return (
    <div data-testid="projections-page">
      <h1>12-Month Projections</h1>
      <table data-testid="projections-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Starting Cash</th>
            <th>Burn</th>
            <th>Ending Cash</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.month} data-testid={`projection-row-${r.month}`} style={{ color: r.endCash < 0 ? "red" : "inherit" }}>
              <td data-testid={`proj-month-${r.month}`}>{r.month}</td>
              <td data-testid={`proj-start-${r.month}`}>${r.startCash.toLocaleString()}</td>
              <td data-testid={`proj-burn-${r.month}`}>${r.burn.toLocaleString()}</td>
              <td data-testid={`proj-end-${r.month}`}>${r.endCash.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
