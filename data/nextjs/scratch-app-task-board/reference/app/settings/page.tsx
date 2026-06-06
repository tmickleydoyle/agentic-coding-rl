'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SettingsPage() {
  const { labels, addLabel } = useApp();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleAdd() {
    if (!name.trim()) { setError('Name required'); return; }
    const result = addLabel({ name: name.trim() });
    if (!result) { setError('Label already exists'); return; }
    setError(''); setName('');
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Settings</h1>
      {error && <div data-testid="label-error" style={{ color: 'red' }}>{error}</div>}
      <div>
        <input data-testid="label-name" placeholder="Label name" value={name} onChange={e => setName(e.target.value)} />
        <button data-testid="add-label-btn" onClick={handleAdd}>Add Label</button>
      </div>
      <ul>
        {labels.map(l => <li key={l.id} data-testid={`label-row-${l.id}`}>{l.name}</li>)}
      </ul>
    </div>
  );
}
