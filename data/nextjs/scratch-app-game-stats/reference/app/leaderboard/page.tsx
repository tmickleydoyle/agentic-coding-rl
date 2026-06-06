"use client";
import React from "react";
import { getLeaderboard } from "../../lib/store";
export function LeaderboardPage() {
  const board = getLeaderboard();
  return (
    <div data-testid="leaderboard-page">
      <h2>Leaderboard</h2>
      <ol data-testid="leaderboard-list">
        {board.map((p, i) => (
          <li key={p.id} data-testid={`lb-item-${p.id}`}>
            <span data-testid={`lb-rank-${p.id}`}>{i + 1}</span>
            <span data-testid={`lb-name-${p.id}`}>{p.name}</span>
            <span data-testid={`lb-points-${p.id}`}>{p.totalPoints}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
