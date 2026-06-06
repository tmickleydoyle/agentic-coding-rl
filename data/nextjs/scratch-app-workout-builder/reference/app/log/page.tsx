'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function LogPage() {
  const { logs, routines, addLog } = useApp();
  const [routineId, setRoutineId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!routineId) { setError('Select a routine'); return; }
    const mins = parseInt(duration);
    if (!mins || mins <= 0) { setError('Duration must be positive'); return; }
    const ok = addLog(routineId, date, mins, notes);
    if (!ok) { setError('Invalid log'); return; }
    setDuration(''); setNotes(''); setError('');
  };

  const getRoutineName = (id: string) => routines.find(r => r.id === id)?.name ?? id;

  return (
    <main data-testid="log-page">
      <h2>Workout Log</h2>
      <div data-testid="add-log-form">
        <select data-testid="log-routine-select" value={routineId} onChange={e => setRoutineId(e.target.value)}>
          <option value="">-- Select Routine --</option>
          {routines.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <input data-testid="log-date-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input data-testid="log-duration-input" type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Minutes" />
        <input data-testid="log-notes-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="add-log-btn" onClick={handleAdd}>Log Session</button>
        {error && <span data-testid="log-error">{error}</span>}
      </div>
      <ul data-testid="log-list">
        {logs.map(l => (
          <li key={l.id} data-testid={`log-item-${l.id}`}>
            <span data-testid={`log-routine-${l.id}`}>{getRoutineName(l.routineId)}</span>
            <span data-testid={`log-date-${l.id}`}>{l.date}</span>
            <span data-testid={`log-duration-${l.id}`}>{l.durationMinutes} min</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
