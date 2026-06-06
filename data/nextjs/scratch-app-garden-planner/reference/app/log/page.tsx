'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { LogEntry } from '../../lib/types';

export function LogPage() {
  const { beds, log, setLog } = useApp();
  const [bedId, setBedId] = useState('');
  const [action, setAction] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!bedId || !action.trim() || !date) return;
    const entry: LogEntry = { id: `lg${Date.now()}`, bedId, action: action.trim(), date, notes: notes.trim() };
    setLog(prev => [...prev, entry]);
    setBedId(''); setAction(''); setDate(''); setNotes('');
  }

  return (
    <div>
      <h2>Activity Log</h2>
      <form data-testid="log-add-form" onSubmit={handleAdd}>
        <select data-testid="log-bed-select" value={bedId} onChange={e => setBedId(e.target.value)}>
          <option value="">Select bed</option>
          {beds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input data-testid="log-action-input" value={action} onChange={e => setAction(e.target.value)} placeholder="Action" />
        <input data-testid="log-date-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input data-testid="log-notes-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="log-submit" type="submit">Add Entry</button>
      </form>
      <ul data-testid="log-list">
        {log.map(e => (
          <li key={e.id} data-testid="log-item">
            <span>{e.action}</span>
            <span>{e.date}</span>
            <button data-testid="log-delete" onClick={() => setLog(prev => prev.filter(x => x.id !== e.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
