'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ProgressPage() {
  const { courses, progress } = useApp();
  const enrolled = courses.filter((c) => c.enrolled);
  return (
    <div data-testid="progress-page">
      <h2>Progress</h2>
      <ul data-testid="progress-list">
        {enrolled.map((c) => {
          const p = progress.find((pr) => pr.courseId === c.id);
          if (!p) return null;
          const pct = Math.round((p.completed / p.total) * 100);
          return (
            <li key={c.id} data-testid={`progress-${c.id}`}>
              <span data-testid={`progress-title-${c.id}`}>{c.title}</span>
              <span data-testid={`progress-count-${c.id}`}>{p.completed}/{p.total}</span>
              <span data-testid={`progress-pct-${c.id}`}>{pct}%</span>
              <span data-testid={`progress-date-${c.id}`}>{p.lastActivity}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
