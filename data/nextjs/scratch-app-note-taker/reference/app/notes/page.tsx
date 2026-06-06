'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function NotesPage() {
  const { notes, addNote, deleteNote, setArchived } = useApp();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const active = notes.filter(n => !n.archived);

  function handleAdd() {
    if (!title.trim()) { setError('Title required'); return; }
    setError('');
    const now = new Date().toISOString();
    addNote({ title: title.trim(), body: body.trim(), tags: tags.split(',').map(t => t.trim()).filter(Boolean), archived: false, createdAt: now, updatedAt: now });
    setTitle(''); setBody(''); setTags('');
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Notes</h1>
      {error && <div data-testid="note-error" style={{ color: 'red' }}>{error}</div>}
      <div>
        <input data-testid="note-title" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input data-testid="note-body" placeholder="Body" value={body} onChange={e => setBody(e.target.value)} />
        <input data-testid="note-tags" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />
        <button data-testid="add-note-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {active.map(n => (
          <li key={n.id} data-testid={`note-row-${n.id}`}>
            <strong>{n.title}</strong>
            <button data-testid={`delete-note-${n.id}`} onClick={() => deleteNote(n.id)}>Delete</button>
            <button data-testid={`archive-note-${n.id}`} onClick={() => setArchived(n.id, true)}>Archive</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
