import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ExpensesPage() {
  const { expenses } = useApp();
  return (
    <div data-testid="expenses-page">
      <h2>All Expenses</h2>
      {expenses.map((e) => (
        <div key={e.id} data-testid="expense-card">
          <span data-testid="expense-description">{e.description}</span>
          <span data-testid="expense-category">{e.category}</span>
          <span data-testid="expense-amount">{e.amount}</span>
          <span data-testid="expense-date">{e.date}</span>
        </div>
      ))}
    </div>
  );
}
