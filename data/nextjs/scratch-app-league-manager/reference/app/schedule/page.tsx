"use client";
import React, { useState } from "react";
import { getTeams, getMatches, addMatch } from "../../lib/store";

export function SchedulePage() {
  const [, rerender] = useState(0);
  const [homeId, setHomeId] = useState("");
  const [awayId, setAwayId] = useState("");
  const [date, setDate] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [error, setError] = useState("");
  const teams = getTeams();
  const matches = getMatches();

  function handleAdd() {
    const result = addMatch(parseInt(homeId), parseInt(awayId), date, parseInt(homeScore), parseInt(awayScore));
    if (!result) { setError("Invalid: different teams, non-negative scores required"); return; }
    setError(""); setHomeId(""); setAwayId(""); setDate(""); setHomeScore(""); setAwayScore("");
    rerender((n) => n + 1);
  }

  return (
    <div data-testid="schedule-page">
      <h2>Schedule</h2>
      <select data-testid="match-home-select" value={homeId} onChange={(e) => setHomeId(e.target.value)}>
        <option value="">Home Team</option>
        {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <select data-testid="match-away-select" value={awayId} onChange={(e) => setAwayId(e.target.value)}>
        <option value="">Away Team</option>
        {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <input data-testid="match-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input data-testid="match-home-score-input" type="number" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} placeholder="Home Score" />
      <input data-testid="match-away-score-input" type="number" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} placeholder="Away Score" />
      <button data-testid="add-match-btn" onClick={handleAdd}>Add Match</button>
      {error && <div data-testid="match-error">{error}</div>}
      <ul data-testid="match-list">
        {matches.map((m) => (
          <li key={m.id} data-testid={`match-item-${m.id}`}>
            <span data-testid={`match-home-${m.id}`}>{m.homeTeamId}</span>
            <span data-testid={`match-away-${m.id}`}>{m.awayTeamId}</span>
            <span data-testid={`match-score-${m.id}`}>{m.homeScore}-{m.awayScore}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
