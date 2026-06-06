'use client';
import React, { useEffect, useState } from 'react';
import { Score } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function RankingsPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [gameFilter, setGameFilter] = useState('All');
  const { navigate, setSelectedPlayer } = useApp();

  useEffect(() => {
    fetch('/api/scores').then((r) => r.json()).then(setScores);
  }, []);

  const filtered = gameFilter === 'All' ? scores : scores.filter((s) => s.game === gameFilter);

  // Group by player, best score per player
  const playerMap = new Map<string, Score>();
  filtered.forEach((s) => {
    const existing = playerMap.get(s.player);
    if (!existing || s.score > existing.score) playerMap.set(s.player, s);
  });

  const rankings: { player: string; score: Score }[] = [];
  playerMap.forEach((score, player) => rankings.push({ player, score }));
  rankings.sort((a, b) => b.score.score - a.score.score);

  return (
    <div data-testid="rankings-page">
      <h1>Rankings</h1>
      <select data-testid="game-filter" value={gameFilter} onChange={(e) => setGameFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Chess">Chess</option>
        <option value="Trivia">Trivia</option>
        <option value="Puzzle">Puzzle</option>
        <option value="Racing">Racing</option>
      </select>
      {rankings.map((r, i) => (
        <div key={r.player} data-testid={`rank-row-${r.player}`}>
          <span data-testid={`rank-pos-${r.player}`}>{i + 1}</span>
          <button data-testid={`rank-player-${r.player}`} onClick={() => { setSelectedPlayer(r.player); navigate('history'); }}>
            {r.player}
          </button>
          <span data-testid={`rank-score-${r.player}`}>{r.score.score}</span>
          <span data-testid={`rank-game-${r.player}`}>{r.score.game}</span>
        </div>
      ))}
    </div>
  );
}
