'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function GroupsPage() {
  const { groups, contacts, addGroup } = useApp();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleAdd() {
    if (!name.trim()) { setError('Name required'); return; }
    const result = addGroup({ name: name.trim() });
    if (!result) { setError('Group already exists'); return; }
    setError(''); setName('');
  }

  function countForGroup(gName: string) {
    return contacts.filter(c => c.group === gName).length;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Groups</h1>
      {error && <div data-testid="group-error" style={{ color: 'red' }}>{error}</div>}
      <div>
        <input data-testid="group-name" placeholder="Group name" value={name} onChange={e => setName(e.target.value)} />
        <button data-testid="add-group-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {groups.map(g => (
          <li key={g.id} data-testid={`group-row-${g.id}`}>{g.name} ({countForGroup(g.name)})</li>
        ))}
      </ul>
    </div>
  );
}
