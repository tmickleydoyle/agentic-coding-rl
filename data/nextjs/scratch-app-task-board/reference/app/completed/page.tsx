'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function CompletedPage() {
  const { tasks, reopenTask } = useApp();
  const done = tasks.filter(t => t.status === 'done');
  return (
    <div style={{ padding: 24 }}>
      <h1>Completed</h1>
      {done.length === 0 && <p data-testid="no-completed">No completed tasks.</p>}
      <ul>
        {done.map(t => (
          <li key={t.id} data-testid={`task-card-${t.id}`}>
            {t.title}
            <button data-testid={`reopen-task-${t.id}`} onClick={() => reopenTask(t.id)}>Reopen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
