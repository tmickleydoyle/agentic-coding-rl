'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { SessionStatus } from '../../lib/types';

export function SessionsPage() {
  const { sessions, tutors, setSessions } = useApp();
  const [filter, setFilter] = useState<'all' | SessionStatus>('all');

  function tutorName(id: number) {
    return tutors.find((t) => t.id === id)?.name ?? 'Unknown';
  }

  async function handleCancel(id: number) {
    const res = await fetch('/api/sessions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'cancelled' }) });
    if (res.ok) setSessions(sessions.map((s) => s.id === id ? { ...s, status: 'cancelled' } : s));
  }

  const filtered = filter === 'all' ? sessions : sessions.filter((s) => s.status === filter);

  return (
    <div data-testid="sessions-page">
      <h2>Sessions</h2>
      <div data-testid="filter-buttons">
        <button data-testid="filter-all" onClick={() => setFilter('all')}>All</button>
        <button data-testid="filter-scheduled" onClick={() => setFilter('scheduled')}>Scheduled</button>
        <button data-testid="filter-completed" onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul data-testid="session-list">
        {filtered.map((s) => (
          <li key={s.id} data-testid={`session-${s.id}`}>
            <span data-testid={`session-tutor-${s.id}`}>{tutorName(s.tutorId)}</span>
            <span data-testid={`session-student-${s.id}`}>{s.studentName}</span>
            <span data-testid={`session-date-${s.id}`}>{s.date}</span>
            <span data-testid={`session-duration-${s.id}`}>{s.duration} min</span>
            <span data-testid={`session-status-${s.id}`}>{s.status}</span>
            {s.status === 'scheduled' && <button data-testid={`cancel-session-${s.id}`} onClick={() => handleCancel(s.id)}>Cancel</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
