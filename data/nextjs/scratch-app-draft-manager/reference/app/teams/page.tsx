"use client";
import React, { useState } from "react";
import { getTeams, addTeam, removeTeam } from "../../lib/store";
export function TeamsPage() {
  const [, rerender] = useState(0);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const teams = getTeams();
  function handleAdd() {
    if (!name.trim() || !owner.trim()) return;
    addTeam(name.trim(), owner.trim());
    setName(""); setOwner("");
    rerender((n) => n + 1);
  }
  return (
    <div data-testid="teams-page">
      <h2>Teams</h2>
      <input data-testid="team-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input data-testid="team-owner-input" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Owner" />
      <button data-testid="add-team-btn" onClick={handleAdd}>Add Team</button>
      <ul data-testid="team-list">
        {teams.map((t) => (
          <li key={t.id} data-testid={`team-item-${t.id}`}>
            <span data-testid={`team-name-${t.id}`}>{t.name}</span>
            <button data-testid={`remove-team-${t.id}`} onClick={() => { removeTeam(t.id); rerender((n) => n + 1); }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
