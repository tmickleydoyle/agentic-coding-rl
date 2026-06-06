'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { expenses, navigate } = useApp();
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const recent = expenses.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <div style={{ marginBottom: 16 }}>
        <strong>Total Spent: </strong>
        <span data-testid="total-spent">${total.toFixed(2)}</span>
      </div>
      <button onClick={() => navigate('expenses')} style={{ marginBottom: 16 }}>Add Expense</button>
      <h2>Recent Expenses</h2>
      <ul data-testid="recent-expenses">
        {recent.map(e => (
          <li key={e.id}>{e.description} — ${e.amount.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
}
