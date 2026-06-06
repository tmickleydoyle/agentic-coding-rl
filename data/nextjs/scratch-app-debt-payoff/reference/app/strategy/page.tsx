import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function StrategyPage() {
  const { debts, payments } = useApp();
  const sorted = [...debts].sort((a, b) => b.interestRate - a.interestRate);

  return (
    <div data-testid="strategy-page">
      <h1>Payoff Strategy (Avalanche)</h1>
      <ul data-testid="strategy-list">
        {sorted.map((d, i) => {
          const paid = payments.filter((p) => p.debtId === d.id).reduce((s, p) => s + p.amount, 0);
          const remaining = Math.max(0, d.balance - paid);
          return (
            <li key={d.id} data-testid={`strategy-${d.id}`}>
              <span data-testid={`strategy-priority-${d.id}`}>{i + 1}</span>
              <span data-testid={`strategy-name-${d.id}`}>{d.name}</span>
              <span data-testid={`strategy-rate-${d.id}`}>{d.interestRate}%</span>
              <span data-testid={`strategy-remaining-${d.id}`}>${remaining.toFixed(2)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
