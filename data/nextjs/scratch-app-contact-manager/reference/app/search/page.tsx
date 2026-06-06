'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SearchPage() {
  const { contacts } = useApp();
  const [query, setQuery] = useState('');

  const results = query
    ? contacts.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase())
      )
    : contacts;

  return (
    <div style={{ padding: 24 }}>
      <h1>Search</h1>
      <input data-testid="search-input" placeholder="Search by name or email" value={query} onChange={e => setQuery(e.target.value)} />
      <ul data-testid="search-results">
        {results.map(c => (
          <li key={c.id} data-testid={`contact-row-${c.id}`}>{c.name} — {c.email}</li>
        ))}
      </ul>
    </div>
  );
}
