"use client";
import React from "react";
import { getStandings } from "../../lib/store";
export function StandingsPage() {
  const standings = getStandings();
  return (
    <div data-testid="standings-page">
      <h2>Standings</h2>
      <ol data-testid="standings-list">
        {standings.map((s, i) => (
          <li key={s.id} data-testid={`standing-item-${s.id}`}>
            <span data-testid={`standing-rank-${s.id}`}>{i + 1}</span>
            <span data-testid={`standing-name-${s.id}`}>{s.teamName}</span>
            <span data-testid={`standing-wins-${s.id}`}>{s.wins}</span>
            <span data-testid={`standing-pts-${s.id}`}>{s.totalPoints}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
