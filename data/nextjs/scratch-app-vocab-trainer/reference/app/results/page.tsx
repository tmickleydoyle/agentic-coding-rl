'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ResultsPage() {
  const { quizResults } = useApp();
  return (
    <main data-testid="results-page">
      <h2>Quiz Results</h2>
      {quizResults.length === 0
        ? <p data-testid="no-results-msg">No quizzes taken yet</p>
        : (
          <ul data-testid="results-list">
            {quizResults.map(r => (
              <li key={r.id} data-testid={`result-item-${r.id}`}>
                <span data-testid={`result-date-${r.id}`}>{r.date}</span>
                <span data-testid={`result-score-${r.id}`}>{r.score} / {r.total}</span>
              </li>
            ))}
          </ul>
        )
      }
    </main>
  );
}
