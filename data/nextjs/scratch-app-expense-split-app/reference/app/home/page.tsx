'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { groups, expenses } = useApp();
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  return (
    <main data-testid="home-page">
      <h1>Expense Splitter</h1>
      <p data-testid="group-count">{groups.length} group(s)</p>
      <p data-testid="total-expenses">${total.toFixed(2)} total expenses</p>
    </main>
  );
}
