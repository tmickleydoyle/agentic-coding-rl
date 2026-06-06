'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Bean } from '../../lib/types';

export function BeansPage() {
  const { beans, setBeans, setBrews } = useApp();
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [roast, setRoast] = useState<Bean['roast']>('medium');
  const [price, setPrice] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !origin.trim()) return;
    const b: Bean = { id: `b${Date.now()}`, name: name.trim(), origin: origin.trim(), roast, price: Number(price) || 0 };
    setBeans(prev => [...prev, b]);
    setName(''); setOrigin(''); setPrice('');
  }

  function handleDelete(id: string) {
    setBrews(prev => prev.filter(br => br.beanId !== id));
    setBeans(prev => prev.filter(b => b.id !== id));
  }

  return (
    <div>
      <h2>Beans</h2>
      <form data-testid="bean-add-form" onSubmit={handleAdd}>
        <input data-testid="bean-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Bean name" />
        <input data-testid="bean-origin-input" value={origin} onChange={e => setOrigin(e.target.value)} placeholder="Origin" />
        <select data-testid="bean-roast-select" value={roast} onChange={e => setRoast(e.target.value as Bean['roast'])}>
          <option value="light">light</option>
          <option value="medium">medium</option>
          <option value="dark">dark</option>
        </select>
        <input data-testid="bean-price-input" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price per 100g" />
        <button data-testid="bean-submit" type="submit">Add Bean</button>
      </form>
      <ul data-testid="bean-list">
        {beans.map(b => (
          <li key={b.id} data-testid="bean-item">
            <span>{b.name}</span>
            <span>{b.roast}</span>
            <button data-testid="bean-delete" onClick={() => handleDelete(b.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
