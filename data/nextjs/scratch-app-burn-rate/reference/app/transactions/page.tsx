import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Transaction, TransactionType } from "../../lib/types";

export default function TransactionsPage() {
  const { transactions, categories, setTransactions } = useApp();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("Expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const amt = parseFloat(amount);
    if (!description.trim()) { setError("Description required"); return; }
    if (isNaN(amt) || amt <= 0) { setError("Amount must be positive"); return; }
    if (!category) { setError("Category required"); return; }
    if (!date.match(/^\d{4}-\d{2}$/)) { setError("Date must be YYYY-MM"); return; }
    setError("");
    const tx: Transaction = { id: String(Date.now()), description: description.trim(), amount: amt, type, category, date };
    setTransactions([...transactions, tx]);
    setDescription(""); setAmount(""); setDate("");
  }

  return (
    <div data-testid="transactions-page">
      <h1>Transactions</h1>
      {error && <div data-testid="tx-error">{error}</div>}
      <div data-testid="add-tx-form">
        <input data-testid="tx-description-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input data-testid="tx-amount-input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <select data-testid="tx-type-select" value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>
        <select data-testid="tx-category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <input data-testid="tx-date-input" value={date} onChange={(e) => setDate(e.target.value)} placeholder="YYYY-MM" />
        <button data-testid="add-tx-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="tx-list">
        {transactions.map((t) => (
          <li key={t.id} data-testid={`tx-item-${t.id}`}>
            <span data-testid={`tx-desc-${t.id}`}>{t.description}</span>
            <span data-testid={`tx-type-${t.id}`}>{t.type}</span>
            <span data-testid={`tx-amount-${t.id}`}>${t.amount.toLocaleString()}</span>
            <span data-testid={`tx-date-${t.id}`}>{t.date}</span>
            <button data-testid={`delete-tx-${t.id}`} onClick={() => setTransactions(transactions.filter((x) => x.id !== t.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
