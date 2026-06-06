"use client";
import React, { useState } from "react";
import { getTeams, getAvailablePlayers, makePick } from "../../lib/store";
export function PicksPage() {
  const [, rerender] = useState(0);
  const [teamId, setTeamId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [error, setError] = useState("");
  const teams = getTeams();
  const available = getAvailablePlayers();
  function handlePick() {
    const pick = makePick(parseInt(teamId), parseInt(playerId));
    if (!pick) { setError("Invalid or already drafted"); return; }
    setError(""); setTeamId(""); setPlayerId("");
    rerender((n) => n + 1);
  }
  return (
    <div data-testid="picks-page">
      <h2>Make Pick</h2>
      <select data-testid="pick-team-select" value={teamId} onChange={(e) => setTeamId(e.target.value)}>
        <option value="">Select team</option>
        {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <select data-testid="pick-player-select" value={playerId} onChange={(e) => setPlayerId(e.target.value)}>
        <option value="">Select player</option>
        {available.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <button data-testid="make-pick-btn" onClick={handlePick}>Make Pick</button>
      {error && <div data-testid="pick-error">{error}</div>}
      <div data-testid="available-count">{available.length}</div>
    </div>
  );
}
