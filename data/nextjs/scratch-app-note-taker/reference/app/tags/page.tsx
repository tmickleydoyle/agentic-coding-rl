'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function TagsPage() {
  const { notes } = useApp();
  const set = new Set<string>();
  notes.forEach(n => n.tags.forEach(t => set.add(t)));
  const tags = Array.from(set).sort();

  return (
    <div style={{ padding: 24 }}>
      <h1>Tags</h1>
      <ul>
        {tags.map(tag => (
          <li key={tag} data-testid={`tag-item-${tag}`}>{tag}</li>
        ))}
      </ul>
    </div>
  );
}
