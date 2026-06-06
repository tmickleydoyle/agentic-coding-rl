import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export function HeirsPage() {
  const { heirs, addHeir, deleteHeir } = useApp();
  const [name, setName] = useState("");
  const [share, setShare] = useState("");

  const totalShare = heirs.reduce((s, h) => s + h.share, 0);

  const handleAdd = () => {
    const num = parseFloat(share);
    if (!name || isNaN(num) || num < 0 || num > 100) return;
    addHeir({ name, share: num });
    setName(""); setShare("");
  };

  return (
    <div data-testid="heirs-page">
      <h1>Heirs</h1>
      <div data-testid="total-share">{totalShare}% total</div>
      {totalShare !== 100 && <div data-testid="share-warning">Warning: total shares do not equal 100%</div>}
      {heirs.length === 0 ? (
        <p data-testid="no-heirs">No heirs found.</p>
      ) : (
        <ul data-testid="heir-list">
          {heirs.map((h) => (
            <li key={h.id} data-testid={`heir-item-${h.id}`}>
              <span data-testid={`heir-name-${h.id}`}>{h.name}</span>
              <span data-testid={`heir-share-${h.id}`}>{h.share}%</span>
              <button data-testid={`delete-heir-${h.id}`} onClick={() => deleteHeir(h.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-heir-form">
        <input data-testid="heir-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="heir-share-input" type="number" value={share} onChange={(e) => setShare(e.target.value)} placeholder="Share %" />
        <button data-testid="add-heir-btn" onClick={handleAdd}>Add Heir</button>
      </div>
    </div>
  );
}
