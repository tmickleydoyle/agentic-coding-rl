'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ExpensesPage() {
  const { groups, expenses, addExpense, deleteExpense } = useApp();
  const [groupId, setGroupId] = useState('');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const selectedGroup = groups.find(g => g.id === groupId);

  const handleAdd = () => {
    if (!groupId || !desc.trim() || !paidBy) { setError('Fill all fields'); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Positive amount required'); return; }
    const ok = addExpense(groupId, desc, amt, paidBy, date);
    if (!ok) { setError('Invalid expense'); return; }
    setDesc(''); setAmount(''); setPaidBy(''); setError('');
  };

  return (
    <main data-testid="expenses-page">
      <h2>Expenses</h2>
      <div data-testid="add-expense-form">
        <select data-testid="expense-group-select" value={groupId} onChange={e => { setGroupId(e.target.value); setPaidBy(''); }}>
          <option value="">-- Select Group --</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <input data-testid="expense-desc-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
        <input data-testid="expense-amount-input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <select data-testid="expense-paidby-select" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
          <option value="">-- Paid By --</option>
          {(selectedGroup?.members ?? []).map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input data-testid="expense-date-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button data-testid="add-expense-btn" onClick={handleAdd}>Add Expense</button>
        {error && <span data-testid="expense-error">{error}</span>}
      </div>
      <ul data-testid="expenses-list">
        {expenses.map(e => (
          <li key={e.id} data-testid={`expense-item-${e.id}`}>
            <span data-testid={`expense-desc-${e.id}`}>{e.description}</span>
            <span data-testid={`expense-amount-${e.id}`}>{e.amount}</span>
            <span data-testid={`expense-paidby-${e.id}`}>{e.paidBy}</span>
            <button data-testid={`delete-expense-${e.id}`} onClick={() => deleteExpense(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
