import React, { useState } from "react";
import { getResidents, addResident, markDeparted } from "../../lib/store";

export function ResidentsPage() {
  const [, setTick] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const residents = getResidents();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addResident(name.trim(), parseInt(age, 10) || 0);
    setName(""); setAge("");
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="residents-page">
      <h2>Residents</h2>
      <form data-testid="resident-form" onSubmit={handleSubmit}>
        <input data-testid="resident-name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input data-testid="resident-age" type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <button data-testid="resident-submit" type="submit">Add Resident</button>
      </form>
      {residents.map((r) => (
        <div key={r.id} data-testid={`resident-row-${r.id}`}>
          <span data-testid={`resident-name-${r.id}`}>{r.name}</span>
          <span data-testid={`resident-status-${r.id}`}>{r.status}</span>
          <span data-testid={`resident-age-${r.id}`}>{r.age}</span>
          {r.status === "Staying" && (
            <button data-testid={`depart-${r.id}`} onClick={() => { markDeparted(r.id); setTick((t) => t + 1); }}>
              Mark Departed
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
