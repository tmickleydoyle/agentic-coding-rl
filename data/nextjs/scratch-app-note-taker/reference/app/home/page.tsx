'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { notes } = useApp();
  const active = notes.filter(n => !n.archived);
  const recent = notes.filter(n => !n.archived).slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);
  return (
    <div style={{ padding: 24 }}>
      <h1>Note Taker</h1>
      <p>Active notes: <span data-testid="active-count">{active.length}</span></p>
      <h2>Recent</h2>
      <ul data-testid="recent-notes">
        {recent.map(n => <li key={n.id}>{n.title}</li>)}
      </ul>
    </div>
  );
}
