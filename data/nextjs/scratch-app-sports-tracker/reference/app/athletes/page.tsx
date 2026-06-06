"use client";
import React, { useState } from "react";
import { getAthletes, addAthlete, removeAthlete } from "../../lib/store";

export function AthletesPage() {
  const [, rerender] = useState(0);
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [position, setPosition] = useState("");
  const athletes = getAthletes();

  function handleAdd() {
    if (!name.trim() || !sport.trim() || !position.trim()) return;
    addAthlete(name.trim(), sport.trim(), position.trim());
    setName("");
    setSport("");
    setPosition("");
    rerender((n) => n + 1);
  }

  function handleRemove(id: number) {
    removeAthlete(id);
    rerender((n) => n + 1);
  }

  return (
    <div data-testid="athletes-page">
      <h2>Athletes</h2>
      <input data-testid="athlete-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input data-testid="athlete-sport-input" value={sport} onChange={(e) => setSport(e.target.value)} placeholder="Sport" />
      <input data-testid="athlete-position-input" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position" />
      <button data-testid="add-athlete-btn" onClick={handleAdd}>Add Athlete</button>
      <ul data-testid="athlete-list">
        {athletes.map((a) => (
          <li key={a.id} data-testid={`athlete-item-${a.id}`}>
            <span data-testid={`athlete-name-${a.id}`}>{a.name}</span>
            <span data-testid={`athlete-sport-${a.id}`}>{a.sport}</span>
            <span data-testid={`athlete-position-${a.id}`}>{a.position}</span>
            <button data-testid={`remove-athlete-${a.id}`} onClick={() => handleRemove(a.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
