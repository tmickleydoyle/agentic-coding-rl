import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function DashboardPage() {
  const { shareholders, rounds } = useApp();
  const totalShares = shareholders.reduce((s, sh) => s + sh.shares, 0);
  const latestPrice = rounds.length > 0 ? rounds[rounds.length - 1].sharePrice : null;
  const totalValue = latestPrice !== null ? totalShares * latestPrice : null;

  return (
    <div data-testid="dashboard-page">
      <h1>Cap Table</h1>
      <div data-testid="total-shares">Total Shares: {totalShares.toLocaleString()}</div>
      <div data-testid="total-shareholders">Shareholders: {shareholders.length}</div>
      <div data-testid="total-value">
        {totalValue !== null ? `Equity Value: $${totalValue.toLocaleString()}` : "Equity Value: N/A"}
      </div>
      <table data-testid="ownership-table">
        <thead>
          <tr><th>Name</th><th>Type</th><th>Shares</th><th>Ownership %</th></tr>
        </thead>
        <tbody>
          {shareholders.map((sh) => (
            <tr key={sh.id} data-testid={`ownership-row-${sh.id}`}>
              <td>{sh.name}</td>
              <td>{sh.type}</td>
              <td>{sh.shares.toLocaleString()}</td>
              <td data-testid={`ownership-pct-${sh.id}`}>
                {totalShares > 0 ? ((sh.shares / totalShares) * 100).toFixed(2) : "0.00"}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
