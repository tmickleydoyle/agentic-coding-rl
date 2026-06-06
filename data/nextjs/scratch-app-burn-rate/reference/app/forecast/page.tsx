import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ForecastPage() {
  const { transactions, startingCash } = useApp();

  const months = Array.from(new Set(transactions.map((t) => t.date))).sort();
  const currentMonth = months.length > 0 ? months[months.length - 1] : null;

  let netBurn = 0;
  if (currentMonth) {
    const monthTx = transactions.filter((t) => t.date === currentMonth);
    const grossBurn = monthTx.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
    const mrr = monthTx.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0);
    netBurn = grossBurn - mrr;
  }

  const rows = [];
  for (let i = 1; i <= 6; i++) {
    const startCash = startingCash - netBurn * (i - 1);
    const endCash = startCash - netBurn;
    rows.push({ month: i, startCash, netBurn, endCash });
  }

  return (
    <div data-testid="forecast-page">
      <h1>6-Month Forecast</h1>
      <div data-testid="forecast-net-burn">Current Net Burn: ${netBurn.toLocaleString()}</div>
      <table data-testid="forecast-table">
        <thead>
          <tr><th>Month</th><th>Start Cash</th><th>Net Burn</th><th>End Cash</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.month} data-testid={`forecast-row-${r.month}`} style={{ color: r.endCash < 0 ? "red" : "inherit" }}>
              <td>{r.month}</td>
              <td data-testid={`forecast-start-${r.month}`}>${r.startCash.toLocaleString()}</td>
              <td>${r.netBurn.toLocaleString()}</td>
              <td data-testid={`forecast-end-${r.month}`}>${r.endCash.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
