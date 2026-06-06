import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function DashboardPage() {
  const { transactions } = useApp();

  const months = Array.from(new Set(transactions.map((t) => t.date))).sort();
  const currentMonth = months.length > 0 ? months[months.length - 1] : null;
  const prevMonth = months.length > 1 ? months[months.length - 2] : null;

  function calcForMonth(month: string) {
    const monthTx = transactions.filter((t) => t.date === month);
    const grossBurn = monthTx.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
    const mrr = monthTx.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0);
    const netBurn = grossBurn - mrr;
    return { grossBurn, mrr, netBurn };
  }

  const current = currentMonth ? calcForMonth(currentMonth) : { grossBurn: 0, mrr: 0, netBurn: 0 };
  const prev = prevMonth ? calcForMonth(prevMonth) : null;
  const momChange = prev !== null ? current.netBurn - prev.netBurn : null;

  return (
    <div data-testid="dashboard-page">
      <h1>Burn Rate Dashboard</h1>
      <div data-testid="current-month">{currentMonth ?? "N/A"}</div>
      <div data-testid="gross-burn">Gross Burn: ${current.grossBurn.toLocaleString()}</div>
      <div data-testid="net-burn">Net Burn: ${current.netBurn.toLocaleString()}</div>
      <div data-testid="mrr">MRR: ${current.mrr.toLocaleString()}</div>
      <div data-testid="mom-change">
        MoM Change: {momChange !== null ? `$${momChange.toLocaleString()}` : "N/A"}
      </div>
    </div>
  );
}
