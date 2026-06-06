import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Category, Expense } from "../../lib/types";

const CATEGORIES: Category[] = ["housing", "food", "transport", "utilities", "entertainment", "other"];

export function ExpensesPage() {
  const { expenses, addExpense, deleteExpense } = useApp();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("other");
  const [date, setDate] = useState("");

  function handleAdd() {
    const amt = parseFloat(amount);
    if (!description || isNaN(amt) || amt <= 0 || !date) return;
    const expense: Expense = {
      id: `e-${Date.now()}`,
      description,
      amount: amt,
      category,
      date,
    };
    addExpense(expense);
    setDescription("");
    setAmount("");
    setDate("");
    setCategory("other");
  }

  return (
    <div data-testid="expenses-page">
      <h1>Expenses</h1>
      <div data-testid="add-expense-form">
        <input
          data-testid="expense-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          data-testid="expense-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <select
          data-testid="expense-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          data-testid="expense-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button data-testid="add-expense-btn" onClick={handleAdd}>Add Expense</button>
      </div>
      <ul data-testid="expense-list">
        {expenses.map((e) => (
          <li key={e.id} data-testid={`expense-${e.id}`}>
            <span data-testid={`expense-desc-${e.id}`}>{e.description}</span>
            <span data-testid={`expense-amount-${e.id}`}>${e.amount.toFixed(2)}</span>
            <span data-testid={`expense-cat-${e.id}`}>{e.category}</span>
            <span data-testid={`expense-date-${e.id}`}>{e.date}</span>
            <button data-testid={`delete-expense-${e.id}`} onClick={() => deleteExpense(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
