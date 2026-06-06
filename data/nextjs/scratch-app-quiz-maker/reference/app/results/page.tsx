'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ResultsPage() {
  const { lastAttempt, questions } = useApp();
  if (!lastAttempt) return <div style={{ padding: 24 }}><h1>Results</h1><p data-testid="no-results">No results yet.</p></div>;

  const qs = questions.filter(q => q.quizId === lastAttempt.quizId);

  return (
    <div style={{ padding: 24 }}>
      <h1>Results</h1>
      <p data-testid="result-score">Score: {lastAttempt.score}/{lastAttempt.total}</p>
      <ul>
        {qs.map((q, i) => {
          const correct = lastAttempt.answers[i] === q.correctIndex;
          return (
            <li key={q.id} data-testid={`result-row-${q.id}`} style={{ color: correct ? 'green' : 'red' }}>
              {q.text} — {correct ? '✓' : '✗'}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
