'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { projects, entries } = useApp();
  const total = entries.reduce((s, e) => s + e.hours, 0);
  const recent = entries.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return (
    <div style={{ padding: 24 }}>
      <h1>Time Logger</h1>
      <p>Total hours: <span data-testid="total-hours">{total.toFixed(1)}</span></p>
      <p>Projects: <span data-testid="project-count">{projects.length}</span></p>
      <h2>Recent Logs</h2>
      <ul data-testid="recent-logs">
        {recent.map(e => <li key={e.id}>{e.description} — {e.hours.toFixed(1)}h</li>)}
      </ul>
    </div>
  );
}
