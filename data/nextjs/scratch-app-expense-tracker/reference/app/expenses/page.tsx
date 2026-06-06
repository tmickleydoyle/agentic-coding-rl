'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ExpensesPage() {
  const { expenses, categories, addExpense, deleteExpense } = useApp();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]?.name ?? '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  function handleAdd() {
    if (!description.trim()) { setError('Description required'); return; }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { setError('Amount must be positive'); return; }
    if (!category) { setError('Category required'); return; }
    setError('');
    addExpense({ description: description.trim(), amount: amt, category, date });
    setDescription('');
    setAmount('');
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Expenses</h1>
      {error && <div style={{ color: 'red' }} data-testid="expense-error">{error}</div>}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input data-testid="expense-description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input data-testid="expense-amount" placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <select data-testid="expense-category" value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <input data-testid="expense-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button data-testid="add-expense-btn" onClick={handleAdd}>Add</button>
      </div>
      <table>
        <thead><tr><th>Description</th><th>Amount</th><th>Category</th><th>Date</th><th>Action</th></tr></thead>
        <tbody>
          {expenses.map(e => (
            <tr key={e.id} data-testid={`expense-row-${e.id}`}>
              <td>{e.description}</td>
              <td>${e.amount.toFixed(2)}</td>
              <td>{e.category}</td>
              <td>{e.date}</td>
              <td><button data-testid={`delete-expense-${e.id}`} onClick={() => deleteExpense(e.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
