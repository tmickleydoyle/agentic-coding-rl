import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { Category } from "../../lib/types";

const CATEGORIES: Category[] = ["housing", "food", "transport", "utilities", "entertainment", "other"];

export function ReportsPage() {
  const { expenses, incomes } = useApp();
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const balance = totalIncome - totalExpenses;

  const byCategory: Record<string, number> = {};
  CATEGORIES.forEach((c) => { byCategory[c] = 0; });
  expenses.forEach((e) => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });

  return (
    <div data-testid="reports-page">
      <h1>Reports</h1>
      <div data-testid="report-summary">
        <span data-testid="report-total-income">${totalIncome.toFixed(2)}</span>
        <span data-testid="report-total-expenses">${totalExpenses.toFixed(2)}</span>
        <span data-testid="report-balance">${balance.toFixed(2)}</span>
      </div>
      <section>
        <h2>By Category</h2>
        <ul data-testid="category-breakdown">
          {CATEGORIES.map((c) => (
            <li key={c} data-testid={`category-${c}`}>
              <span data-testid={`category-name-${c}`}>{c}</span>
              <span data-testid={`category-total-${c}`}>${(byCategory[c] || 0).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
