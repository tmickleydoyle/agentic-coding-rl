'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function LeaderboardPage() {
  const { scores } = useApp();
  const sorted = [...scores].sort((a, b) => b.wpm - a.wpm);
  return (
    <main data-testid="leaderboard-page">
      <h2>Leaderboard</h2>
      {sorted.length === 0
        ? <p data-testid="no-scores-msg">No scores yet</p>
        : (
          <ol data-testid="leaderboard-list">
            {sorted.map((s, i) => (
              <li key={s.id} data-testid={`score-item-${s.id}`}>
                <span data-testid={`score-rank-${s.id}`}>{i + 1}</span>
                <span data-testid={`score-name-${s.id}`}>{s.name}</span>
                <span data-testid={`score-wpm-${s.id}`}>{s.wpm} WPM</span>
                <span data-testid={`score-accuracy-${s.id}`}>{s.accuracy}%</span>
                <span data-testid={`score-date-${s.id}`}>{s.date}</span>
              </li>
            ))}
          </ol>
        )
      }
    </main>
  );
}
