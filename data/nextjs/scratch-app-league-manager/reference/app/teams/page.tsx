"use client";
import React, { useState } from "react";
import { getTeams, addTeam, removeTeam } from "../../lib/store";

export function TeamsPage() {
  const [, rerender] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [coach, setCoach] = useState("");
  const teams = getTeams();

  function handleAdd() {
    if (!name.trim() || !city.trim() || !coach.trim()) return;
    addTeam(name.trim(), city.trim(), coach.trim());
    setName(""); setCity(""); setCoach("");
    rerender((n) => n + 1);
  }

  return (
    <div data-testid="teams-page">
      <h2>Teams</h2>
      <input data-testid="team-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input data-testid="team-city-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
      <input data-testid="team-coach-input" value={coach} onChange={(e) => setCoach(e.target.value)} placeholder="Coach" />
      <button data-testid="add-team-btn" onClick={handleAdd}>Add Team</button>
      <ul data-testid="team-list">
        {teams.map((t) => (
          <li key={t.id} data-testid={`team-item-${t.id}`}>
            <span data-testid={`team-name-${t.id}`}>{t.name}</span>
            <span data-testid={`team-city-${t.id}`}>{t.city}</span>
            <button data-testid={`remove-team-${t.id}`} onClick={() => { removeTeam(t.id); rerender((n) => n + 1); }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
