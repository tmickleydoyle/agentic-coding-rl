import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Shareholder, ShareholderType } from "../../lib/types";

const TYPES: ShareholderType[] = ["Founder", "Employee", "Investor", "Advisor"];

export default function ShareholdersPage() {
  const { shareholders, setShareholders } = useApp();
  const [name, setName] = useState("");
  const [type, setType] = useState<ShareholderType>("Founder");
  const [shares, setShares] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const sharesNum = parseInt(shares, 10);
    if (!name.trim()) { setError("Name required"); return; }
    if (isNaN(sharesNum) || sharesNum <= 0) { setError("Shares must be positive"); return; }
    setError("");
    const sh: Shareholder = { id: String(Date.now()), name: name.trim(), type, shares: sharesNum };
    setShareholders([...shareholders, sh]);
    setName(""); setShares("");
  }

  return (
    <div data-testid="shareholders-page">
      <h1>Shareholders</h1>
      {error && <div data-testid="shareholder-error">{error}</div>}
      <div data-testid="add-shareholder-form">
        <input data-testid="shareholder-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <select data-testid="shareholder-type-select" value={type} onChange={(e) => setType(e.target.value as ShareholderType)}>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input data-testid="shareholder-shares-input" type="number" value={shares} onChange={(e) => setShares(e.target.value)} placeholder="Shares" />
        <button data-testid="add-shareholder-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="shareholder-list">
        {shareholders.map((sh) => (
          <li key={sh.id} data-testid={`shareholder-item-${sh.id}`}>
            <span data-testid={`sh-name-${sh.id}`}>{sh.name}</span>
            <span data-testid={`sh-type-${sh.id}`}>{sh.type}</span>
            <span data-testid={`sh-shares-${sh.id}`}>{sh.shares.toLocaleString()}</span>
            <button data-testid={`delete-sh-${sh.id}`} onClick={() => setShareholders(shareholders.filter((s) => s.id !== sh.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
