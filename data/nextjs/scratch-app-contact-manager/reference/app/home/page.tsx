'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { contacts, groups, navigate } = useApp();
  return (
    <div style={{ padding: 24 }}>
      <h1>Contacts</h1>
      <p>Total contacts: <span data-testid="contact-count">{contacts.length}</span></p>
      <h2>Groups</h2>
      <ul>{groups.map(g => <li key={g.id}>{g.name}</li>)}</ul>
      <button onClick={() => navigate('contacts')}>Add Contact</button>
    </div>
  );
}
