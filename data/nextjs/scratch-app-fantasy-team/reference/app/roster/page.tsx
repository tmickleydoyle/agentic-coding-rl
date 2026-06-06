"use client";
import React, { useState } from "react";
import { getRoster, dropFromRoster } from "../../lib/store";
export function RosterPage() {
  const [, rerender] = useState(0);
  const roster = getRoster();
  return (
    <div data-testid="roster-page">
      <h2>My Roster</h2>
      <div data-testid="roster-count">{roster.length}</div>
      <ul data-testid="roster-list">
        {roster.map((p) => (
          <li key={p.id} data-testid={`roster-item-${p.id}`}>
            <span data-testid={`roster-name-${p.id}`}>{p.name}</span>
            <span data-testid={`roster-pos-${p.id}`}>{p.position}</span>
            <span data-testid={`roster-pts-${p.id}`}>{p.fantasyPoints}</span>
            <button data-testid={`drop-player-${p.id}`} onClick={() => { dropFromRoster(p.id); rerender((n) => n + 1); }}>Drop</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
