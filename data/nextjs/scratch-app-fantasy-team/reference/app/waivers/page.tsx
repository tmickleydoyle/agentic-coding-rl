"use client";
import React, { useState } from "react";
import { getWaivers, addToRoster, getRoster } from "../../lib/store";
export function WaiversPage() {
  const [, rerender] = useState(0);
  const [error, setError] = useState("");
  const waivers = getWaivers();
  const rosterSize = getRoster().length;
  function handleAdd(playerId: number) {
    const result = addToRoster(playerId);
    if (!result) { setError("Cannot add: roster full or already on roster"); return; }
    setError("");
    rerender((n) => n + 1);
  }
  return (
    <div data-testid="waivers-page">
      <h2>Waiver Wire</h2>
      <div data-testid="roster-size">{rosterSize}</div>
      {error && <div data-testid="waiver-error">{error}</div>}
      <ul data-testid="waivers-list">
        {waivers.map((p) => (
          <li key={p.id} data-testid={`waiver-item-${p.id}`}>
            <span data-testid={`waiver-name-${p.id}`}>{p.name}</span>
            <span data-testid={`waiver-pos-${p.id}`}>{p.position}</span>
            <button data-testid={`add-player-${p.id}`} onClick={() => handleAdd(p.id)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
