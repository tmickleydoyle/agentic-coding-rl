'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function CalendarPage() {
  const { subs } = useApp();
  const sorted = [...subs].sort((a, b) => a.billingDay - b.billingDay);
  return (
    <div>
      <h2>Calendar</h2>
      <ul data-testid="calendar-list">
        {sorted.map(s => (
          <li key={s.id} data-testid="calendar-item">
            <span>{s.billingDay}</span>
            <span>{s.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
