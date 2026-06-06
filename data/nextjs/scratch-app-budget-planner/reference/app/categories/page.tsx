'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function CategoriesPage() {
  const { categories, addCategory, deleteCategory } = useApp();
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!name.trim()) { setError('Name required'); return; }
    const ok = addCategory(name, type, parseFloat(limit) || 0);
    if (!ok) { setError('Failed'); return; }
    setName(''); setLimit(''); setError('');
  };

  return (
    <main data-testid="categories-page">
      <h2>Categories</h2>
      <div data-testid="add-category-form">
        <input data-testid="cat-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <select data-testid="cat-type-select" value={type} onChange={e => setType(e.target.value as 'income' | 'expense')}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input data-testid="cat-limit-input" type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="Budget limit" />
        <button data-testid="add-cat-btn" onClick={handleAdd}>Add Category</button>
        {error && <span data-testid="cat-error">{error}</span>}
      </div>
      <ul data-testid="categories-list">
        {categories.map(c => (
          <li key={c.id} data-testid={`cat-item-${c.id}`}>
            <span data-testid={`cat-name-${c.id}`}>{c.name}</span>
            <span data-testid={`cat-type-${c.id}`}>{c.type}</span>
            <span data-testid={`cat-limit-${c.id}`}>{c.budgetLimit}</span>
            <button data-testid={`delete-cat-${c.id}`} onClick={() => deleteCategory(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
