'use client';
import React, { useEffect, useState } from 'react';
import { Score } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function HistoryPage() {
  const { selectedPlayer } = useApp();
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    fetch('/api/scores').then((r) => r.json()).then(setScores);
  }, []);

  const playerScores = scores.filter((s) => s.player === selectedPlayer);

  if (!selectedPlayer) return <div data-testid="history-page"><p data-testid="no-player">No player selected</p></div>;

  return (
    <div data-testid="history-page">
      <h1 data-testid="history-player">{selectedPlayer}</h1>
      <div data-testid="history-list">
        {playerScores.map((s) => (
          <div key={s.id} data-testid={`history-score-${s.id}`}>
            <span data-testid={`history-game-${s.id}`}>{s.game}</span>
            <span data-testid={`history-val-${s.id}`}>{s.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
