'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SummaryPage() {
  const { students, records } = useApp();
  const dates = Array.from(new Set(records.map((r) => r.date)));
  const totalSessions = dates.length;

  return (
    <div data-testid="summary-page">
      <h2>Summary</h2>
      <p data-testid="total-sessions">Sessions: {totalSessions}</p>
      <ul data-testid="summary-list">
        {students.map((s) => {
          const sr = records.filter((r) => r.studentId === s.id);
          const present = sr.filter((r) => r.status === 'present').length;
          const absent = sr.filter((r) => r.status === 'absent').length;
          const late = sr.filter((r) => r.status === 'late').length;
          const rate = totalSessions > 0 ? Math.round((present / totalSessions) * 100) : 0;
          return (
            <li key={s.id} data-testid={`summary-${s.id}`}>
              <span data-testid={`summary-name-${s.id}`}>{s.name}</span>
              <span data-testid={`summary-present-${s.id}`}>{present}</span>
              <span data-testid={`summary-absent-${s.id}`}>{absent}</span>
              <span data-testid={`summary-late-${s.id}`}>{late}</span>
              <span data-testid={`summary-rate-${s.id}`}>{rate}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
