"use client";
import React, { useState } from "react";
import { getMatches, getFlags, addFlag } from "../../lib/store";
import { FlagType } from "../../lib/types";
export function FlagsPage() {
  const [, rerender] = useState(0);
  const [matchId, setMatchId] = useState("");
  const [minute, setMinute] = useState("");
  const [type, setType] = useState<FlagType>("foul");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const matches = getMatches();
  const flags = getFlags();
  function handleAdd() {
    const result = addFlag(parseInt(matchId), parseInt(minute), type, note);
    if (!result) { setError("Invalid: minute 1-90 required"); return; }
    setError(""); setMatchId(""); setMinute(""); setNote("");
    rerender((n) => n + 1);
  }
  return (
    <div data-testid="flags-page">
      <h2>Flags</h2>
      <select data-testid="flag-match-select" value={matchId} onChange={(e) => setMatchId(e.target.value)}>
        <option value="">Select match</option>
        {matches.map((m) => <option key={m.id} value={m.id}>{m.homeTeam} vs {m.awayTeam}</option>)}
      </select>
      <input data-testid="flag-minute-input" type="number" value={minute} onChange={(e) => setMinute(e.target.value)} placeholder="Minute" />
      <select data-testid="flag-type-select" value={type} onChange={(e) => setType(e.target.value as FlagType)}>
        <option value="foul">Foul</option>
        <option value="yellow">Yellow</option>
        <option value="red">Red</option>
        <option value="offside">Offside</option>
      </select>
      <input data-testid="flag-note-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
      <button data-testid="add-flag-btn" onClick={handleAdd}>Add Flag</button>
      {error && <div data-testid="flag-error">{error}</div>}
      <ul data-testid="flag-list">
        {flags.map((f) => (
          <li key={f.id} data-testid={`flag-item-${f.id}`}>
            <span data-testid={`flag-type-${f.id}`}>{f.type}</span>
            <span data-testid={`flag-minute-${f.id}`}>{f.minute}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
