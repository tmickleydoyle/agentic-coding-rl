'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function TransactionsPage() {
  const { transactions, categories, addTransaction, deleteTransaction } = useApp();
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (!desc.trim()) { setError('Description required'); return; }
    if (!amount || amt === 0 || isNaN(amt)) { setError('Non-zero amount required'); return; }
    const ok = addTransaction(desc, amt, category, date);
    if (!ok) { setError('Invalid transaction'); return; }
    setDesc(''); setAmount(''); setError('');
  };

  const getCatName = (id: string) => categories.find(c => c.id === id)?.name ?? id;

  return (
    <main data-testid="transactions-page">
      <h2>Transactions</h2>
      <div data-testid="add-transaction-form">
        <input data-testid="tx-desc-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
        <input data-testid="tx-amount-input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <select data-testid="tx-category-select" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">-- Category --</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input data-testid="tx-date-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button data-testid="add-tx-btn" onClick={handleAdd}>Add</button>
        {error && <span data-testid="tx-error">{error}</span>}
      </div>
      <ul data-testid="transactions-list">
        {transactions.map(t => (
          <li key={t.id} data-testid={`tx-item-${t.id}`}>
            <span data-testid={`tx-desc-${t.id}`}>{t.description}</span>
            <span data-testid={`tx-amount-${t.id}`}>{t.amount}</span>
            <span data-testid={`tx-cat-${t.id}`}>{getCatName(t.category)}</span>
            <button data-testid={`delete-tx-${t.id}`} onClick={() => deleteTransaction(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
