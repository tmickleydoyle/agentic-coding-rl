import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Deduction, DeductionCategory } from "../../lib/types";

const CATEGORIES: DeductionCategory[] = ["business", "charitable", "medical", "education", "other"];

export function DeductionsPage() {
  const { deductions, addDeduction, deleteDeduction } = useApp();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<DeductionCategory>("other");
  const [filter, setFilter] = useState<string>("all");

  function handleAdd() {
    const amt = parseFloat(amount);
    if (!description || isNaN(amt) || amt <= 0) return;
    addDeduction({ id: `ded-${Date.now()}`, description, amount: amt, category });
    setDescription(""); setAmount(""); setCategory("other");
  }

  const filtered = filter === "all" ? deductions : deductions.filter((d) => d.category === filter);

  return (
    <div data-testid="deductions-page">
      <h1>Deductions</h1>
      <div data-testid="add-deduction-form">
        <input data-testid="deduction-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input data-testid="deduction-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <select data-testid="deduction-category" value={category} onChange={(e) => setCategory(e.target.value as DeductionCategory)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button data-testid="add-deduction-btn" onClick={handleAdd}>Add Deduction</button>
      </div>
      <select data-testid="filter-category" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <ul data-testid="deduction-list">
        {filtered.map((d) => (
          <li key={d.id} data-testid={`deduction-${d.id}`}>
            <span data-testid={`deduction-desc-${d.id}`}>{d.description}</span>
            <span data-testid={`deduction-amount-${d.id}`}>${d.amount.toFixed(2)}</span>
            <span data-testid={`deduction-cat-${d.id}`}>{d.category}</span>
            <button data-testid={`delete-deduction-${d.id}`} onClick={() => deleteDeduction(d.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
