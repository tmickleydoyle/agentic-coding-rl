import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Round } from "../../lib/types";

export default function RoundsPage() {
  const { rounds, setRounds } = useApp();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const [newShares, setNewShares] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const price = parseFloat(sharePrice);
    const ns = parseInt(newShares, 10);
    if (!name.trim()) { setError("Name required"); return; }
    if (!date) { setError("Date required"); return; }
    if (isNaN(price) || price <= 0) { setError("Share price must be positive"); return; }
    if (isNaN(ns) || ns <= 0) { setError("New shares must be positive"); return; }
    setError("");
    const round: Round = { id: String(Date.now()), name: name.trim(), date, sharePrice: price, newShares: ns };
    setRounds([...rounds, round]);
    setName(""); setDate(""); setSharePrice(""); setNewShares("");
  }

  return (
    <div data-testid="rounds-page">
      <h1>Funding Rounds</h1>
      {error && <div data-testid="round-error">{error}</div>}
      <div data-testid="add-round-form">
        <input data-testid="round-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Round name" />
        <input data-testid="round-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="round-price-input" type="number" value={sharePrice} onChange={(e) => setSharePrice(e.target.value)} placeholder="Share price" />
        <input data-testid="round-shares-input" type="number" value={newShares} onChange={(e) => setNewShares(e.target.value)} placeholder="New shares" />
        <button data-testid="add-round-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="round-list">
        {rounds.map((r) => (
          <li key={r.id} data-testid={`round-item-${r.id}`}>
            <span data-testid={`round-name-${r.id}`}>{r.name}</span>
            <span data-testid={`round-date-${r.id}`}>{r.date}</span>
            <span data-testid={`round-price-${r.id}`}>${r.sharePrice}</span>
            <span data-testid={`round-newshares-${r.id}`}>{r.newShares.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
