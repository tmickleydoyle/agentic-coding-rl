'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SessionsPage() {
  const { sessions, subjects, addSession, deleteSession } = useApp();
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!subjectId) { setError('Select a subject'); return; }
    const mins = parseInt(duration, 10);
    if (!mins || mins <= 0) { setError('Duration must be positive'); return; }
    const ok = addSession(subjectId, date, mins, notes);
    if (!ok) { setError('Invalid session'); return; }
    setDuration('');
    setNotes('');
    setError('');
  };

  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name ?? id;

  return (
    <main data-testid="sessions-page">
      <h2>Study Sessions</h2>
      <div data-testid="add-session-form">
        <select data-testid="session-subject-select" value={subjectId} onChange={e => setSubjectId(e.target.value)}>
          <option value="">-- Select Subject --</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input
          data-testid="session-date-input"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <input
          data-testid="session-duration-input"
          type="number"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          placeholder="Minutes"
        />
        <input
          data-testid="session-notes-input"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notes"
        />
        <button data-testid="add-session-btn" onClick={handleAdd}>Add Session</button>
        {error && <span data-testid="session-error">{error}</span>}
      </div>
      <ul data-testid="sessions-list">
        {sessions.map(s => (
          <li key={s.id} data-testid={`session-item-${s.id}`}>
            <span data-testid={`session-subject-${s.id}`}>{getSubjectName(s.subjectId)}</span>
            <span data-testid={`session-date-${s.id}`}>{s.date}</span>
            <span data-testid={`session-duration-${s.id}`}>{s.durationMinutes} min</span>
            <span data-testid={`session-notes-${s.id}`}>{s.notes}</span>
            <button data-testid={`delete-session-${s.id}`} onClick={() => deleteSession(s.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
