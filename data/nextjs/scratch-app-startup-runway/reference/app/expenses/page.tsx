import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Category, Expense } from "../../lib/types";

const CATEGORIES: Category[] = ["Engineering", "Marketing", "Operations", "Sales"];

export default function ExpensesPage() {
  const { expenses, setExpenses } = useApp();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Engineering");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState<Category>("Engineering");
  const [editAmount, setEditAmount] = useState("");

  function handleAdd() {
    const amt = parseFloat(amount);
    if (!name.trim()) { setError("Name is required"); return; }
    if (isNaN(amt) || amt <= 0) { setError("Amount must be positive"); return; }
    setError("");
    const newExpense: Expense = {
      id: String(Date.now()),
      name: name.trim(),
      category,
      amount: amt,
    };
    setExpenses([...expenses, newExpense]);
    setName("");
    setAmount("");
  }

  function handleDelete(id: string) {
    setExpenses(expenses.filter((e) => e.id !== id));
  }

  function startEdit(e: Expense) {
    setEditId(e.id);
    setEditName(e.name);
    setEditCategory(e.category);
    setEditAmount(String(e.amount));
  }

  function handleSaveEdit() {
    const amt = parseFloat(editAmount);
    if (!editId) return;
    setExpenses(
      expenses.map((e) =>
        e.id === editId ? { ...e, name: editName, category: editCategory, amount: amt } : e
      )
    );
    setEditId(null);
  }

  return (
    <div data-testid="expenses-page">
      <h1>Expenses</h1>
      {error && <div data-testid="expense-error">{error}</div>}
      <div data-testid="add-expense-form">
        <input
          data-testid="expense-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <select
          data-testid="expense-category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          data-testid="expense-amount-input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <button data-testid="add-expense-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="expense-list">
        {expenses.map((e) => (
          <li key={e.id} data-testid={`expense-item-${e.id}`}>
            {editId === e.id ? (
              <>
                <input data-testid="edit-name-input" value={editName} onChange={(ev) => setEditName(ev.target.value)} />
                <select data-testid="edit-category-select" value={editCategory} onChange={(ev) => setEditCategory(ev.target.value as Category)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input data-testid="edit-amount-input" type="number" value={editAmount} onChange={(ev) => setEditAmount(ev.target.value)} />
                <button data-testid="save-edit-btn" onClick={handleSaveEdit}>Save</button>
              </>
            ) : (
              <>
                <span data-testid={`expense-name-${e.id}`}>{e.name}</span>
                <span data-testid={`expense-category-${e.id}`}>{e.category}</span>
                <span data-testid={`expense-amount-${e.id}`}>${e.amount.toLocaleString()}</span>
                <button data-testid={`edit-btn-${e.id}`} onClick={() => startEdit(e)}>Edit</button>
                <button data-testid={`delete-btn-${e.id}`} onClick={() => handleDelete(e.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
