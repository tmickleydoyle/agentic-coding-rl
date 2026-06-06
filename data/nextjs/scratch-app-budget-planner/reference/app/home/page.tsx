'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { transactions } = useApp();
  const balance = transactions.reduce((s, t) => s + t.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  return (
    <main data-testid="home-page">
      <h1>Budget Planner</h1>
      <p data-testid="total-balance">Balance: {balance.toFixed(2)}</p>
      <p data-testid="total-income">Income: {income.toFixed(2)}</p>
      <p data-testid="total-expenses">Expenses: {expenses.toFixed(2)}</p>
    </main>
  );
}
