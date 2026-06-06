"use client";
import React, { useState } from "react";
import { getMatches, addMatch } from "../../lib/store";
export function MatchesPage() {
  const [, rerender] = useState(0);
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const matches = getMatches();
  function handleAdd() {
    if (!home.trim() || !away.trim() || !date || !venue.trim()) return;
    addMatch(home.trim(), away.trim(), date, venue.trim());
    setHome(""); setAway(""); setDate(""); setVenue("");
    rerender((n) => n + 1);
  }
  return (
    <div data-testid="matches-page">
      <h2>Matches</h2>
      <input data-testid="match-home-input" value={home} onChange={(e) => setHome(e.target.value)} placeholder="Home Team" />
      <input data-testid="match-away-input" value={away} onChange={(e) => setAway(e.target.value)} placeholder="Away Team" />
      <input data-testid="match-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input data-testid="match-venue-input" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" />
      <button data-testid="add-match-btn" onClick={handleAdd}>Add Match</button>
      <ul data-testid="match-list">
        {matches.map((m) => (
          <li key={m.id} data-testid={`match-item-${m.id}`}>
            <span data-testid={`match-home-${m.id}`}>{m.homeTeam}</span>
            <span data-testid={`match-away-${m.id}`}>{m.awayTeam}</span>
            <span data-testid={`match-venue-${m.id}`}>{m.venue}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
