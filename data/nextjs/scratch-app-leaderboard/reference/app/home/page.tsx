'use client';
import React, { useEffect, useState } from 'react';
import { Score } from '../../lib/types';

export function HomePage() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    fetch('/api/scores').then((r) => r.json()).then(setScores);
  }, []);

  const players = new Set(scores.map((s) => s.player));
  const top = scores.reduce<Score | null>((best, s) => (!best || s.score > best.score) ? s : best, null);

  return (
    <div data-testid="home-page">
      <h1>Leaderboard</h1>
      <div data-testid="stat-scores">Scores: {scores.length}</div>
      <div data-testid="stat-players">Players: {players.size}</div>
      <div data-testid="stat-top">{top ? `${top.player}: ${top.score}` : 'None'}</div>
    </div>
  );
}
