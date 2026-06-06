import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { Expense, ExpenseCategory } from "../../lib/types";

let clientId = 100;

export default function AddExpensePage() {
  const { navigate, addExpense } = useApp();
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [originalAmount, setOriginalAmount] = useState(0);

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const expense: Expense = { id: String(++clientId), date, description, category, amount, currency, originalAmount };
    addExpense(expense);
    navigate("/expenses");
  }

  return (
    <div data-testid="add-expense-page">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input data-testid="input-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="input-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <select data-testid="input-category" value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Accommodation">Accommodation</option>
          <option value="Activities">Activities</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <input data-testid="input-amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <input data-testid="input-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
        <input data-testid="input-original-amount" type="number" value={originalAmount} onChange={(e) => setOriginalAmount(Number(e.target.value))} />
        <button type="submit" data-testid="submit-expense">Save Expense</button>
      </form>
    </div>
  );
}
