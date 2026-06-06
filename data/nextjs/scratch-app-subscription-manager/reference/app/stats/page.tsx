'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function StatsPage() {
  const { subs } = useApp();
  const active = subs.filter(s => s.status === 'active');
  const totalCost = active.reduce((sum, s) => sum + s.monthlyCost, 0);

  const categoryMap: Record<string, { count: number; cost: number }> = {};
  subs.forEach(s => {
    if (!categoryMap[s.category]) categoryMap[s.category] = { count: 0, cost: 0 };
    categoryMap[s.category].count += 1;
    categoryMap[s.category].cost += s.monthlyCost;
  });
  const categories = Object.keys(categoryMap);

  return (
    <div>
      <h2>Stats</h2>
      <div data-testid="stats-total-cost">{totalCost.toFixed(2)}</div>
      <ul data-testid="stats-category-list">
        {categories.map(cat => (
          <li key={cat} data-testid="stats-category-item">
            <span>{cat}</span>
            <span>{categoryMap[cat].count}</span>
            <span>{categoryMap[cat].cost.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
