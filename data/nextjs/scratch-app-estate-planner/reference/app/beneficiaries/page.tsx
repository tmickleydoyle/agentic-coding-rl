import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Relationship } from "../../lib/types";

export function BeneficiariesPage() {
  const { beneficiaries, addBeneficiary, deleteBeneficiary } = useApp();
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("Other");

  const handleAdd = () => {
    if (!name) return;
    addBeneficiary({ name, relationship });
    setName("");
  };

  return (
    <div data-testid="beneficiaries-page">
      <h1>Beneficiaries</h1>
      {beneficiaries.length === 0 ? (
        <p data-testid="no-beneficiaries">No beneficiaries found.</p>
      ) : (
        <ul data-testid="beneficiary-list">
          {beneficiaries.map((b) => (
            <li key={b.id} data-testid={`beneficiary-item-${b.id}`}>
              <span data-testid={`beneficiary-name-${b.id}`}>{b.name}</span>
              <span data-testid={`beneficiary-rel-${b.id}`}>{b.relationship}</span>
              <button data-testid={`delete-beneficiary-${b.id}`} onClick={() => deleteBeneficiary(b.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-beneficiary-form">
        <input data-testid="beneficiary-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <select data-testid="beneficiary-rel-select" value={relationship} onChange={(e) => setRelationship(e.target.value as Relationship)}>
          <option>Spouse</option>
          <option>Child</option>
          <option>Sibling</option>
          <option>Other</option>
        </select>
        <button data-testid="add-beneficiary-btn" onClick={handleAdd}>Add Beneficiary</button>
      </div>
    </div>
  );
}
