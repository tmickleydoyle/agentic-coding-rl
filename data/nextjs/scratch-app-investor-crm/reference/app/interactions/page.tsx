import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Interaction, InteractionType } from "../../lib/types";

const TYPES: InteractionType[] = ["Call", "Email", "Meeting"];

export default function InteractionsPage() {
  const { investors, interactions, setInteractions } = useApp();
  const [investorId, setInvestorId] = useState("");
  const [type, setType] = useState<InteractionType>("Call");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!investorId) { setError("Select an investor"); return; }
    if (!notes.trim()) { setError("Notes required"); return; }
    if (!date) { setError("Date required"); return; }
    setError("");
    const interaction: Interaction = { id: String(Date.now()), investorId, type, notes: notes.trim(), date };
    setInteractions([...interactions, interaction]);
    setNotes(""); setDate("");
  }

  return (
    <div data-testid="interactions-page">
      <h1>Interactions</h1>
      {error && <div data-testid="interaction-error">{error}</div>}
      <div data-testid="add-interaction-form">
        <select data-testid="interaction-investor-select" value={investorId} onChange={(e) => setInvestorId(e.target.value)}>
          <option value="">Select investor</option>
          {investors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <select data-testid="interaction-type-select" value={type} onChange={(e) => setType(e.target.value as InteractionType)}>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input data-testid="interaction-notes-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <input data-testid="interaction-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button data-testid="add-interaction-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="interaction-list">
        {interactions.map((i) => {
          const inv = investors.find((v) => v.id === i.investorId);
          return (
            <li key={i.id} data-testid={`interaction-item-${i.id}`}>
              <span data-testid={`interaction-investor-${i.id}`}>{inv ? inv.name : "Unknown"}</span>
              <span data-testid={`interaction-type-${i.id}`}>{i.type}</span>
              <span data-testid={`interaction-notes-${i.id}`}>{i.notes}</span>
              <span data-testid={`interaction-date-${i.id}`}>{i.date}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
