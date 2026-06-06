import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Bill, BillCategory } from "../../lib/types";

const CATEGORIES: BillCategory[] = ["housing", "utilities", "health", "entertainment", "insurance", "other"];

export function BillsPage() {
  const { bills, addBill, deleteBill, toggleBill } = useApp();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [category, setCategory] = useState<BillCategory>("other");

  function handleAdd() {
    const amt = parseFloat(amount);
    const day = parseInt(dueDay);
    if (!name || isNaN(amt) || isNaN(day) || day < 1 || day > 28) return;
    addBill({ id: `b-${Date.now()}`, name, amount: amt, dueDay: day, category, isActive: true });
    setName(""); setAmount(""); setDueDay(""); setCategory("other");
  }

  return (
    <div data-testid="bills-page">
      <h1>Bills</h1>
      <div data-testid="add-bill-form">
        <input data-testid="bill-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="bill-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input data-testid="bill-due-day" type="number" value={dueDay} onChange={(e) => setDueDay(e.target.value)} placeholder="Due Day (1-28)" />
        <select data-testid="bill-category" value={category} onChange={(e) => setCategory(e.target.value as BillCategory)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button data-testid="add-bill-btn" onClick={handleAdd}>Add Bill</button>
      </div>
      <ul data-testid="bill-list">
        {bills.map((b) => (
          <li key={b.id} data-testid={`bill-${b.id}`}>
            <span data-testid={`bill-name-${b.id}`}>{b.name}</span>
            <span data-testid={`bill-amount-${b.id}`}>${b.amount.toFixed(2)}</span>
            <span data-testid={`bill-day-${b.id}`}>Day {b.dueDay}</span>
            <span data-testid={`bill-active-${b.id}`}>{b.isActive ? "active" : "inactive"}</span>
            <button data-testid={`toggle-bill-${b.id}`} onClick={() => toggleBill(b.id)}>Toggle</button>
            <button data-testid={`delete-bill-${b.id}`} onClick={() => deleteBill(b.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
