'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { vehicles, serviceRecords, reminders } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const overdueCount = reminders.filter(r => !r.completed && r.dueDate < today).length;
  return (
    <div>
      <h1>Car Maintenance</h1>
      <div data-testid="dashboard-vehicle-count">{vehicles.length}</div>
      <div data-testid="dashboard-overdue-count">{overdueCount}</div>
      <div data-testid="dashboard-service-count">{serviceRecords.length}</div>
    </div>
  );
}
