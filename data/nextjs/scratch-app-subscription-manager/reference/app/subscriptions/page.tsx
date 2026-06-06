'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Subscription } from '../../lib/types';

export function SubscriptionsPage() {
  const { subs, setSubs } = useApp();
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [day, setDay] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'active' | 'paused'>('active');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || Number(cost) <= 0 || !category.trim() || Number(day) < 1 || Number(day) > 31) return;
    const s: Subscription = {
      id: `s${Date.now()}`,
      name: name.trim(),
      monthlyCost: Number(cost),
      billingDay: Number(day),
      category: category.trim(),
      status,
    };
    setSubs(prev => [...prev, s]);
    setName(''); setCost(''); setDay(''); setCategory(''); setStatus('active');
  }

  function handleToggle(id: string) {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s));
  }

  function handleDelete(id: string) {
    setSubs(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div>
      <h2>Subscriptions</h2>
      <form data-testid="sub-add-form" onSubmit={handleAdd}>
        <input data-testid="sub-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input data-testid="sub-cost-input" type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="Monthly cost" />
        <input data-testid="sub-day-input" type="number" value={day} onChange={e => setDay(e.target.value)} placeholder="Billing day (1-31)" />
        <input data-testid="sub-category-input" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
        <select data-testid="sub-status-select" value={status} onChange={e => setStatus(e.target.value as 'active' | 'paused')}>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
        <button data-testid="sub-submit" type="submit">Add</button>
      </form>
      <ul data-testid="sub-list">
        {subs.map(s => (
          <li key={s.id} data-testid="sub-item">
            <span>{s.name}</span>
            <span>{s.status}</span>
            <span>{s.monthlyCost}</span>
            <button data-testid="sub-toggle" onClick={() => handleToggle(s.id)}>Toggle</button>
            <button data-testid="sub-delete" onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
