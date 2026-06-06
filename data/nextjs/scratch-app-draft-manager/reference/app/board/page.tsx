"use client";
import React from "react";
import { getPicks, getTeams, getPlayers } from "../../lib/store";
export function BoardPage() {
  const picks = getPicks().slice().sort((a, b) => a.pickNumber - b.pickNumber);
  const teams = getTeams();
  const players = getPlayers();
  function getTeamName(id: number) { return teams.find((t) => t.id === id)?.name ?? String(id); }
  function getPlayerName(id: number) { return players.find((p) => p.id === id)?.name ?? String(id); }
  return (
    <div data-testid="board-page">
      <h2>Draft Board</h2>
      <div data-testid="pick-count">{picks.length}</div>
      <ul data-testid="board-list">
        {picks.map((pick) => (
          <li key={pick.id} data-testid={`board-pick-${pick.id}`}>
            <span data-testid={`pick-number-${pick.id}`}>{pick.pickNumber}</span>
            <span data-testid={`pick-round-${pick.id}`}>{pick.round}</span>
            <span data-testid={`pick-team-${pick.id}`}>{getTeamName(pick.teamId)}</span>
            <span data-testid={`pick-player-${pick.id}`}>{getPlayerName(pick.playerId)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
