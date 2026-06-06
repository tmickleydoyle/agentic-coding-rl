'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function CategoriesPage() {
  const { categories, expenses, addCategory } = useApp();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6b7280');
  const [error, setError] = useState('');

  function handleAdd() {
    if (!name.trim()) { setError('Name required'); return; }
    const result = addCategory({ name: name.trim(), color });
    if (!result) { setError('Category already exists'); return; }
    setError('');
    setName('');
    setColor('#6b7280');
  }

  function totalForCategory(catName: string) {
    return expenses.filter(e => e.category === catName).reduce((sum, e) => sum + e.amount, 0);
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Categories</h1>
      {error && <div style={{ color: 'red' }} data-testid="category-error">{error}</div>}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <input data-testid="category-name" placeholder="Category name" value={name} onChange={e => setName(e.target.value)} />
        <input data-testid="category-color" type="color" value={color} onChange={e => setColor(e.target.value)} />
        <button data-testid="add-category-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {categories.map(c => (
          <li key={c.id} data-testid={`category-row-${c.id}`} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ width: 16, height: 16, background: c.color, display: 'inline-block', borderRadius: 2 }} />
            <span>{c.name}</span>
            <span>${totalForCategory(c.name).toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
