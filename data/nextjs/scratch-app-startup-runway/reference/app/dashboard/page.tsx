import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function DashboardPage() {
  const { expenses, settings } = useApp();
  const monthlyBurn = expenses.reduce((s, e) => s + e.amount, 0);
  const runwayMonths = monthlyBurn === 0 ? Infinity : Math.floor(settings.cashBalance / monthlyBurn);
  const runwayOk = runwayMonths >= settings.targetRunway;

  return (
    <div data-testid="dashboard-page">
      <h1>Dashboard</h1>
      <div data-testid="cash-balance" style={{ color: settings.cashBalance < 0 ? "red" : "inherit" }}>
        Cash Balance: ${settings.cashBalance.toLocaleString()}
      </div>
      <div data-testid="monthly-burn">Monthly Burn: ${monthlyBurn.toLocaleString()}</div>
      <div
        data-testid="runway-months"
        style={{ color: runwayOk ? "green" : "red" }}
      >
        Runway: {runwayMonths === Infinity ? "∞" : runwayMonths} months
      </div>
      <div data-testid="runway-status">{runwayOk ? "On Track" : "Below Target"}</div>
      <table data-testid="expenses-summary">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} data-testid={`expense-row-${e.id}`}>
              <td>{e.name}</td>
              <td>{e.category}</td>
              <td>${e.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
