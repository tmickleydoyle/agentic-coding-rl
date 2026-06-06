import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Level } from "../../lib/types";

export default function AthletesPage() {
  const { athletes, addAthlete, deleteAthlete, activeAthleteId, setActiveAthleteId } = useApp();
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [level, setLevel] = useState<Level>("beginner");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addAthlete(name, sport, level);
    setName("");
    setSport("");
  }

  return (
    <div data-testid="athletes-page">
      <h1>Athletes</h1>
      <form data-testid="add-athlete-form" onSubmit={handleSubmit}>
        <input data-testid="input-athlete-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="input-athlete-sport" value={sport} onChange={(e) => setSport(e.target.value)} placeholder="Sport" />
        <select data-testid="input-athlete-level" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button type="submit" data-testid="btn-add-athlete">Add</button>
      </form>
      <ul data-testid="athlete-list">
        {athletes.map((a) => (
          <li key={a.id} data-testid={`athlete-item-${a.id}`}>
            <button data-testid={`btn-select-athlete-${a.id}`} onClick={() => setActiveAthleteId(a.id)}>
              <span data-testid={`athlete-name-${a.id}`}>{a.name}</span>
            </button>
            {activeAthleteId === a.id && <span data-testid="active-athlete-indicator"> (active)</span>}
            <span data-testid={`athlete-sport-${a.id}`}>{a.sport}</span>
            <button data-testid={`btn-delete-athlete-${a.id}`} onClick={() => deleteAthlete(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
