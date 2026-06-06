import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function HomePage() {
  const { expenses, incomes } = useApp();
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div data-testid="home-page">
      <h1>Home Budget</h1>
      <div data-testid="summary">
        <span data-testid="total-income">${totalIncome.toFixed(2)}</span>
        <span data-testid="total-expenses">${totalExpenses.toFixed(2)}</span>
        <span data-testid="balance">${balance.toFixed(2)}</span>
      </div>
      <section>
        <h2>Recent Expenses</h2>
        <ul data-testid="recent-expenses">
          {expenses.slice(-3).map((e) => (
            <li key={e.id} data-testid={`recent-expense-${e.id}`}>
              {e.description}: ${e.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Recent Income</h2>
        <ul data-testid="recent-incomes">
          {incomes.slice(-3).map((i) => (
            <li key={i.id} data-testid={`recent-income-${i.id}`}>
              {i.source}: ${i.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
