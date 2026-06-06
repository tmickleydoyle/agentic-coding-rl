import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Income } from "../../lib/types";

export function IncomePage() {
  const { incomes, addIncome, deleteIncome } = useApp();
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  function handleAdd() {
    const amt = parseFloat(amount);
    if (!source || isNaN(amt) || amt <= 0 || !date) return;
    const income: Income = {
      id: `i-${Date.now()}`,
      source,
      amount: amt,
      date,
    };
    addIncome(income);
    setSource("");
    setAmount("");
    setDate("");
  }

  return (
    <div data-testid="income-page">
      <h1>Income</h1>
      <div data-testid="add-income-form">
        <input
          data-testid="income-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Source"
        />
        <input
          data-testid="income-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <input
          data-testid="income-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button data-testid="add-income-btn" onClick={handleAdd}>Add Income</button>
      </div>
      <ul data-testid="income-list">
        {incomes.map((i) => (
          <li key={i.id} data-testid={`income-${i.id}`}>
            <span data-testid={`income-source-${i.id}`}>{i.source}</span>
            <span data-testid={`income-amount-${i.id}`}>${i.amount.toFixed(2)}</span>
            <span data-testid={`income-date-${i.id}`}>{i.date}</span>
            <button data-testid={`delete-income-${i.id}`} onClick={() => deleteIncome(i.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
