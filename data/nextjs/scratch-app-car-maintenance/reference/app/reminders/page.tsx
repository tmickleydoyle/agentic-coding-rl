'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Reminder } from '../../lib/types';

export function RemindersPage() {
  const { vehicles, reminders, setReminders } = useApp();
  const [vehicleId, setVehicleId] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueMileage, setDueMileage] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicleId || !title.trim() || !dueDate) return;
    const r: Reminder = { id: `r${Date.now()}`, vehicleId, title: title.trim(), dueDate, dueMileage: Number(dueMileage) || 0, completed: false };
    setReminders(prev => [...prev, r]);
    setVehicleId(''); setTitle(''); setDueDate(''); setDueMileage('');
  }

  function handleToggle(id: string) {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  }

  return (
    <div>
      <h2>Reminders</h2>
      <form data-testid="reminder-add-form" onSubmit={handleAdd}>
        <select data-testid="reminder-vehicle-select" value={vehicleId} onChange={e => setVehicleId(e.target.value)}>
          <option value="">Select vehicle</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}
        </select>
        <input data-testid="reminder-title-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="reminder-due-date-input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <input data-testid="reminder-due-mileage-input" type="number" value={dueMileage} onChange={e => setDueMileage(e.target.value)} placeholder="Due mileage" />
        <button data-testid="reminder-submit" type="submit">Add Reminder</button>
      </form>
      <ul data-testid="reminder-list">
        {reminders.map(r => (
          <li key={r.id} data-testid="reminder-item">
            <span>{r.title}</span>
            <span>{r.completed ? 'done' : 'pending'}</span>
            <button data-testid="reminder-toggle" onClick={() => handleToggle(r.id)}>Toggle</button>
            <button data-testid="reminder-delete" onClick={() => setReminders(prev => prev.filter(x => x.id !== r.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
