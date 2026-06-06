'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { plants, beds, log } = useApp();
  const now = new Date();
  const thisMonthCount = log.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  return (
    <div>
      <h1>Garden Dashboard</h1>
      <div data-testid="dashboard-plant-count">{plants.length}</div>
      <div data-testid="dashboard-bed-count">{beds.length}</div>
      <div data-testid="dashboard-log-count">{thisMonthCount}</div>
    </div>
  );
}
