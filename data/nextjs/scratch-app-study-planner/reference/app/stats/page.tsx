'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function StatsPage() {
  const { sessions, subjects } = useApp();

  const totalSessions = sessions.length;
  const longestSession = sessions.reduce((max, s) => Math.max(max, s.durationMinutes), 0);

  const minutesBySubject: Record<string, number> = {};
  subjects.forEach(s => { minutesBySubject[s.id] = 0; });
  sessions.forEach(s => {
    minutesBySubject[s.subjectId] = (minutesBySubject[s.subjectId] ?? 0) + s.durationMinutes;
  });

  return (
    <main data-testid="stats-page">
      <h2>Statistics</h2>
      <p data-testid="total-sessions">{totalSessions} total sessions</p>
      <p data-testid="longest-session">{longestSession} min longest session</p>
      <ul data-testid="stats-by-subject">
        {subjects.map(s => (
          <li key={s.id} data-testid={`stat-subject-${s.id}`}>
            <span data-testid={`stat-name-${s.id}`}>{s.name}</span>
            <span data-testid={`stat-minutes-${s.id}`}>{minutesBySubject[s.id] ?? 0} min</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
