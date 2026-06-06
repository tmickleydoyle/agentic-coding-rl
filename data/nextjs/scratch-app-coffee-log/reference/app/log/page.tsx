'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Brew } from '../../lib/types';

export function LogPage() {
  const { beans, brews, setBrews } = useApp();
  const [beanId, setBeanId] = useState('');
  const [method, setMethod] = useState<Brew['method']>('pour-over');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!beanId || !date || !rating || Number(rating) < 1 || Number(rating) > 5) return;
    const br: Brew = { id: `br${Date.now()}`, beanId, method, date, rating: Number(rating), notes: notes.trim() };
    setBrews(prev => [...prev, br]);
    setBeanId(''); setDate(''); setRating(''); setNotes('');
  }

  return (
    <div>
      <h2>Brew Log</h2>
      <form data-testid="brew-add-form" onSubmit={handleAdd}>
        <select data-testid="brew-bean-select" value={beanId} onChange={e => setBeanId(e.target.value)}>
          <option value="">Select bean</option>
          {beans.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select data-testid="brew-method-select" value={method} onChange={e => setMethod(e.target.value as Brew['method'])}>
          <option value="espresso">espresso</option>
          <option value="pour-over">pour-over</option>
          <option value="french-press">french-press</option>
          <option value="aeropress">aeropress</option>
          <option value="cold-brew">cold-brew</option>
        </select>
        <input data-testid="brew-date-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input data-testid="brew-rating-input" type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} placeholder="Rating (1-5)" />
        <input data-testid="brew-notes-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="brew-submit" type="submit">Add Brew</button>
      </form>
      <ul data-testid="brew-list">
        {brews.map(br => (
          <li key={br.id} data-testid="brew-item">
            <span>{br.method}</span>
            <span>{br.date}</span>
            <span>{br.rating}</span>
            <button data-testid="brew-delete" onClick={() => setBrews(prev => prev.filter(x => x.id !== br.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
