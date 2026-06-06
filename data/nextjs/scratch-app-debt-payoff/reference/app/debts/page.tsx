import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Debt } from "../../lib/types";

export function DebtsPage() {
  const { debts, addDebt, deleteDebt } = useApp();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");

  function handleAdd() {
    const bal = parseFloat(balance);
    const rate = parseFloat(interestRate);
    const min = parseFloat(minimumPayment);
    if (!name || isNaN(bal) || isNaN(rate) || isNaN(min)) return;
    addDebt({ id: `d-${Date.now()}`, name, balance: bal, interestRate: rate, minimumPayment: min });
    setName(""); setBalance(""); setInterestRate(""); setMinimumPayment("");
  }

  return (
    <div data-testid="debts-page">
      <h1>Debts</h1>
      <div data-testid="add-debt-form">
        <input data-testid="debt-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="debt-balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="Balance" />
        <input data-testid="debt-interest" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="Interest Rate %" />
        <input data-testid="debt-minimum" type="number" value={minimumPayment} onChange={(e) => setMinimumPayment(e.target.value)} placeholder="Minimum Payment" />
        <button data-testid="add-debt-btn" onClick={handleAdd}>Add Debt</button>
      </div>
      <ul data-testid="debt-list">
        {debts.map((d) => (
          <li key={d.id} data-testid={`debt-${d.id}`}>
            <span data-testid={`debt-name-${d.id}`}>{d.name}</span>
            <span data-testid={`debt-balance-${d.id}`}>${d.balance.toFixed(2)}</span>
            <span data-testid={`debt-rate-${d.id}`}>{d.interestRate}%</span>
            <button data-testid={`delete-debt-${d.id}`} onClick={() => deleteDebt(d.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
