import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Liability, LiabilityCategory } from "../../lib/types";

const CATEGORIES: LiabilityCategory[] = ["mortgage", "loan", "credit_card", "other"];

export function LiabilitiesPage() {
  const { liabilities, addLiability, deleteLiability } = useApp();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<LiabilityCategory>("other");

  function handleAdd() {
    const amt = parseFloat(amount);
    if (!name || isNaN(amt) || amt <= 0) return;
    addLiability({ id: `l-${Date.now()}`, name, amount: amt, category });
    setName(""); setAmount(""); setCategory("other");
  }

  return (
    <div data-testid="liabilities-page">
      <h1>Liabilities</h1>
      <div data-testid="add-liability-form">
        <input data-testid="liability-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="liability-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <select data-testid="liability-category" value={category} onChange={(e) => setCategory(e.target.value as LiabilityCategory)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button data-testid="add-liability-btn" onClick={handleAdd}>Add Liability</button>
      </div>
      <ul data-testid="liability-list">
        {liabilities.map((l) => (
          <li key={l.id} data-testid={`liability-${l.id}`}>
            <span data-testid={`liability-name-${l.id}`}>{l.name}</span>
            <span data-testid={`liability-amount-${l.id}`}>${l.amount.toFixed(2)}</span>
            <span data-testid={`liability-cat-${l.id}`}>{l.category}</span>
            <button data-testid={`delete-liability-${l.id}`} onClick={() => deleteLiability(l.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
