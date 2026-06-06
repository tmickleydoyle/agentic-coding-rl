'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { pets, visits, medications } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const upcomingVisits = visits.filter(v => v.date >= today).length;
  const activeMeds = medications.filter(m => m.active).length;
  return (
    <div>
      <h1>Pet Records</h1>
      <div data-testid="dashboard-pet-count">{pets.length}</div>
      <div data-testid="dashboard-upcoming-visits">{upcomingVisits}</div>
      <div data-testid="dashboard-active-meds">{activeMeds}</div>
    </div>
  );
}
