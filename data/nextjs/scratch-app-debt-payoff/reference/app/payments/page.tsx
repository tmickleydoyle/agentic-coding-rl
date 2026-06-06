import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Payment } from "../../lib/types";

export function PaymentsPage() {
  const { debts, payments, addPayment } = useApp();
  const [debtId, setDebtId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  function handleAdd() {
    const amt = parseFloat(amount);
    if (!debtId || isNaN(amt) || amt <= 0 || !date) return;
    addPayment({ id: `p-${Date.now()}`, debtId, amount: amt, date });
    setAmount(""); setDate("");
  }

  return (
    <div data-testid="payments-page">
      <h1>Payments</h1>
      <div data-testid="add-payment-form">
        <select data-testid="payment-debt" value={debtId} onChange={(e) => setDebtId(e.target.value)}>
          <option value="">Select debt</option>
          {debts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input data-testid="payment-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input data-testid="payment-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button data-testid="add-payment-btn" onClick={handleAdd}>Add Payment</button>
      </div>
      <ul data-testid="payment-list">
        {payments.map((p) => (
          <li key={p.id} data-testid={`payment-${p.id}`}>
            <span data-testid={`payment-debt-${p.id}`}>{p.debtId}</span>
            <span data-testid={`payment-amount-${p.id}`}>${p.amount.toFixed(2)}</span>
            <span data-testid={`payment-date-${p.id}`}>{p.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
