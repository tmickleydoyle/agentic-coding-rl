'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function GroupsPage() {
  const { groups, addGroup, deleteGroup } = useApp();
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const memberList = members.split(',').map(m => m.trim()).filter(Boolean);
    if (!name.trim()) { setError('Name required'); return; }
    if (memberList.length === 0) { setError('At least one member required'); return; }
    const ok = addGroup(name, memberList);
    if (!ok) { setError('Failed'); return; }
    setName(''); setMembers(''); setError('');
  };

  return (
    <main data-testid="groups-page">
      <h2>Groups</h2>
      <div data-testid="add-group-form">
        <input data-testid="group-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Group name" />
        <input data-testid="group-members-input" value={members} onChange={e => setMembers(e.target.value)} placeholder="Members (comma-separated)" />
        <button data-testid="add-group-btn" onClick={handleAdd}>Add Group</button>
        {error && <span data-testid="group-error">{error}</span>}
      </div>
      <ul data-testid="groups-list">
        {groups.map(g => (
          <li key={g.id} data-testid={`group-item-${g.id}`}>
            <span data-testid={`group-name-${g.id}`}>{g.name}</span>
            <span data-testid={`group-members-${g.id}`}>{g.members.join(', ')}</span>
            <button data-testid={`delete-group-${g.id}`} onClick={() => deleteGroup(g.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
