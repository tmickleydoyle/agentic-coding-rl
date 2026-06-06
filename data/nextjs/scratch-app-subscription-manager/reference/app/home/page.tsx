'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { subs } = useApp();
  const active = subs.filter(s => s.status === 'active');
  const monthlyCost = active.reduce((sum, s) => sum + s.monthlyCost, 0);
  return (
    <div>
      <h1>Dashboard</h1>
      <div data-testid="dashboard-total-count">{subs.length}</div>
      <div data-testid="dashboard-active-count">{active.length}</div>
      <div data-testid="dashboard-monthly-cost">{monthlyCost.toFixed(2)}</div>
    </div>
  );
}
