"use client";
import React from "react";
import { getMatches, getPlayers } from "../../lib/store";
export function BracketPage() {
  const matches = getMatches();
  const players = getPlayers();
  function getName(id: number) { return players.find((p) => p.id === id)?.name ?? String(id); }
  return (
    <div data-testid="bracket-page">
      <h2>Bracket</h2>
      <ul data-testid="bracket-list">
        {matches.map((m) => (
          <li key={m.id} data-testid={`bracket-match-${m.id}`}>
            <span data-testid={`bracket-round-${m.id}`}>{m.round}</span>
            <span data-testid={`bracket-p1-${m.id}`}>{getName(m.player1Id)}</span>
            <span data-testid={`bracket-p2-${m.id}`}>{getName(m.player2Id)}</span>
            <span data-testid={`bracket-winner-${m.id}`}>{m.winnerId ? getName(m.winnerId) : ""}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
