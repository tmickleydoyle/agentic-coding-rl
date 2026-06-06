'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function PreviewPage() {
  const { modules, lessons } = useApp();
  const totalDuration = lessons.reduce((sum, l) => sum + l.duration, 0);
  const sorted = [...modules].sort((a, b) => a.order - b.order);

  return (
    <div data-testid="preview-page">
      <h2>Preview</h2>
      <p data-testid="total-duration">Total: {totalDuration} min</p>
      <ul data-testid="preview-module-list">
        {sorted.map((m) => {
          const mLessons = lessons.filter((l) => l.moduleId === m.id);
          return (
            <li key={m.id} data-testid={`preview-module-${m.id}`}>
              <span data-testid={`preview-module-title-${m.id}`}>{m.title}</span>
              <ul data-testid={`preview-lessons-${m.id}`}>
                {mLessons.map((l) => (
                  <li key={l.id} data-testid={`preview-lesson-${l.id}`}>
                    <span data-testid={`preview-lesson-title-${l.id}`}>{l.title}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
