'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SummaryPage() {
  const { categories, expenses } = useApp();

  function totalForCategory(catName: string) {
    return expenses.filter(e => e.category === catName).reduce((sum, e) => sum + e.amount, 0);
  }

  const maxTotal = Math.max(...categories.map(c => totalForCategory(c.name)), 1);

  return (
    <div style={{ padding: 24 }}>
      <h1>Summary</h1>
      {categories.map(c => {
        const total = totalForCategory(c.name);
        const pct = (total / maxTotal) * 100;
        return (
          <div key={c.id} data-testid={`summary-row-${c.name}`} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{c.name}</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ background: '#e2e8f0', height: 16, borderRadius: 4 }}>
              <div style={{ width: `${pct}%`, height: '100%', background: c.color, borderRadius: 4 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
