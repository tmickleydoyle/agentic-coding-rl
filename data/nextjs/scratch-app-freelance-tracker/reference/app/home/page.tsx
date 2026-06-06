'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { clients, projects, invoices } = useApp();
  const unpaidTotal = invoices
    .filter(i => i.status === 'unpaid')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div>
      <h1>Dashboard</h1>
      <div data-testid="dashboard-clients-count">{clients.length}</div>
      <div data-testid="dashboard-projects-count">{projects.length}</div>
      <div data-testid="dashboard-unpaid-total">{unpaidTotal}</div>
    </div>
  );
}
