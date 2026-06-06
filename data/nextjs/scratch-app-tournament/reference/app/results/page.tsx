"use client";
import React, { useState } from "react";
import { getMatches, getPlayers, recordResult } from "../../lib/store";
export function ResultsPage() {
  const [, rerender] = useState(0);
  const [matchId, setMatchId] = useState("");
  const [winnerId, setWinnerId] = useState("");
  const [error, setError] = useState("");
  const matches = getMatches();
  const players = getPlayers();
  function getName(id: number) { return players.find((p) => p.id === id)?.name ?? String(id); }
  function handleRecord() {
    const result = recordResult(parseInt(matchId), parseInt(winnerId));
    if (!result) { setError("Invalid match or winner"); return; }
    setError(""); setMatchId(""); setWinnerId("");
    rerender((n) => n + 1);
  }
  const completedMatches = matches.filter((m) => m.winnerId !== null);
  return (
    <div data-testid="results-page">
      <h2>Results</h2>
      <select data-testid="result-match-select" value={matchId} onChange={(e) => setMatchId(e.target.value)}>
        <option value="">Select match</option>
        {matches.map((m) => <option key={m.id} value={m.id}>Match {m.id}</option>)}
      </select>
      <select data-testid="result-winner-select" value={winnerId} onChange={(e) => setWinnerId(e.target.value)}>
        <option value="">Select winner</option>
        {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <button data-testid="record-result-btn" onClick={handleRecord}>Record Result</button>
      {error && <div data-testid="result-error">{error}</div>}
      <ul data-testid="results-list">
        {completedMatches.map((m) => (
          <li key={m.id} data-testid={`result-item-${m.id}`}>
            <span data-testid={`result-match-${m.id}`}>Match {m.id}</span>
            <span data-testid={`result-winner-name-${m.id}`}>{getName(m.winnerId!)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
