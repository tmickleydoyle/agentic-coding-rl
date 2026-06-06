'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SummaryPage() {
  const { transactions, categories } = useApp();
  const income = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const balance = income + expenses;

  const spendByCategory: Record<string, number> = {};
  transactions.forEach(t => {
    spendByCategory[t.category] = (spendByCategory[t.category] ?? 0) + Math.abs(t.amount);
  });

  return (
    <main data-testid="summary-page">
      <h2>Summary</h2>
      <p data-testid="summary-income">Income: {income.toFixed(2)}</p>
      <p data-testid="summary-expenses">Expenses: {Math.abs(expenses).toFixed(2)}</p>
      <p data-testid="summary-balance">Balance: {balance.toFixed(2)}</p>
      <ul data-testid="category-breakdown">
        {categories.map(c => (
          <li key={c.id} data-testid={`summary-cat-${c.id}`}>
            <span data-testid={`summary-cat-name-${c.id}`}>{c.name}</span>
            <span data-testid={`summary-cat-actual-${c.id}`}>{(spendByCategory[c.id] ?? 0).toFixed(2)}</span>
            <span data-testid={`summary-cat-limit-${c.id}`}>{c.budgetLimit}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
