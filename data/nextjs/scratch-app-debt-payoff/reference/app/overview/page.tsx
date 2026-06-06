import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function OverviewPage() {
  const { debts, payments } = useApp();
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalOriginal = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalRemaining = debts.reduce((sum, d) => {
    const paid = payments.filter((p) => p.debtId === d.id).reduce((s, p) => s + p.amount, 0);
    return sum + Math.max(0, d.balance - paid);
  }, 0);

  return (
    <div data-testid="overview-page">
      <h1>Debt Overview</h1>
      <span data-testid="total-remaining">${totalRemaining.toFixed(2)}</span>
      <span data-testid="total-paid">${totalPaid.toFixed(2)}</span>
      <span data-testid="debt-count">{debts.length}</span>
    </div>
  );
}
