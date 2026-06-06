"use client";
import React, { useState } from "react";
import { getPlayers, addPlayer, removePlayer } from "../../lib/store";
export function PlayersPage() {
  const [, rerender] = useState(0);
  const [name, setName] = useState("");
  const [seed, setSeed] = useState("");
  const [country, setCountry] = useState("");
  const players = getPlayers();
  function handleAdd() {
    if (!name.trim() || !country.trim()) return;
    addPlayer(name.trim(), parseInt(seed), country.trim());
    setName(""); setSeed(""); setCountry("");
    rerender((n) => n + 1);
  }
  return (
    <div data-testid="players-page">
      <h2>Players</h2>
      <input data-testid="player-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input data-testid="player-seed-input" type="number" value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="Seed" />
      <input data-testid="player-country-input" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
      <button data-testid="add-player-btn" onClick={handleAdd}>Add Player</button>
      <ul data-testid="player-list">
        {players.map((p) => (
          <li key={p.id} data-testid={`player-item-${p.id}`}>
            <span data-testid={`player-name-${p.id}`}>{p.name}</span>
            <span data-testid={`player-country-${p.id}`}>{p.country}</span>
            <button data-testid={`remove-player-${p.id}`} onClick={() => { removePlayer(p.id); rerender((n) => n + 1); }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
