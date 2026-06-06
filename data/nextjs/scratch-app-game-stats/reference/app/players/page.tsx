"use client";
import React, { useState } from "react";
import { getPlayers, addPlayer, removePlayer } from "../../lib/store";
export function PlayersPage() {
  const [, rerender] = useState(0);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const players = getPlayers();
  function handleAdd() {
    const p = addPlayer(name.trim(), parseInt(number), position.trim());
    if (!p) { setError("Number must be > 0"); return; }
    setError(""); setName(""); setNumber(""); setPosition("");
    rerender((n) => n + 1);
  }
  return (
    <div data-testid="players-page">
      <h2>Players</h2>
      <input data-testid="player-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input data-testid="player-number-input" type="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Number" />
      <input data-testid="player-position-input" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position" />
      <button data-testid="add-player-btn" onClick={handleAdd}>Add Player</button>
      {error && <div data-testid="player-error">{error}</div>}
      <ul data-testid="player-list">
        {players.map((p) => (
          <li key={p.id} data-testid={`player-item-${p.id}`}>
            <span data-testid={`player-name-${p.id}`}>{p.name}</span>
            <span data-testid={`player-number-${p.id}`}>{p.number}</span>
            <button data-testid={`remove-player-${p.id}`} onClick={() => { removePlayer(p.id); rerender((n) => n + 1); }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
