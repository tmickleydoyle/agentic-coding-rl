'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Note } from '../../lib/types';

export function NotesPage() {
  const { applications, notes, setNotes } = useApp();
  const [applicationId, setApplicationId] = useState('');
  const [text, setText] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!applicationId || !text.trim()) return;
    const n: Note = { id: `n${Date.now()}`, applicationId, text: text.trim(), createdAt: new Date().toISOString().slice(0, 10) };
    setNotes(prev => [...prev, n]);
    setApplicationId(''); setText('');
  }

  return (
    <div>
      <h2>Notes</h2>
      <form data-testid="note-add-form" onSubmit={handleAdd}>
        <select data-testid="note-app-select" value={applicationId} onChange={e => setApplicationId(e.target.value)}>
          <option value="">Select application</option>
          {applications.map(a => <option key={a.id} value={a.id}>{a.company}</option>)}
        </select>
        <input data-testid="note-text-input" value={text} onChange={e => setText(e.target.value)} placeholder="Note text" />
        <button data-testid="note-submit" type="submit">Add</button>
      </form>
      <ul data-testid="note-list">
        {notes.map(n => {
          const app = applications.find(a => a.id === n.applicationId);
          return (
            <li key={n.id} data-testid="note-item">
              <span>{n.text}</span>
              <span>{app?.company ?? ''}</span>
              <button data-testid="note-delete" onClick={() => setNotes(prev => prev.filter(x => x.id !== n.id))}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
