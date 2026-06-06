import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export function WitnessesPage() {
  const { witnesses, addWitness, toggleWitness } = useApp();
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name) return;
    addWitness(name);
    setName("");
  };

  return (
    <div data-testid="witnesses-page">
      <h1>Witnesses</h1>
      {witnesses.length === 0 ? (
        <p data-testid="no-witnesses">No witnesses yet.</p>
      ) : (
        <ul data-testid="witness-list">
          {witnesses.map((w) => (
            <li key={w.id} data-testid={`witness-item-${w.id}`}>
              <span data-testid={`witness-name-${w.id}`}>{w.name}</span>
              <span data-testid={`witness-status-${w.id}`}>{w.status}</span>
              <button data-testid={`toggle-witness-${w.id}`} onClick={() => toggleWitness(w.id)}>Toggle</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-witness-form">
        <input data-testid="witness-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <button data-testid="add-witness-btn" onClick={handleAdd}>Add Witness</button>
      </div>
    </div>
  );
}
