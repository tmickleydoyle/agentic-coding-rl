'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ArchivePage() {
  const { notes, setArchived } = useApp();
  const archived = notes.filter(n => n.archived);
  return (
    <div style={{ padding: 24 }}>
      <h1>Archive</h1>
      {archived.length === 0
        ? <p data-testid="no-archived">No archived notes.</p>
        : (
          <ul data-testid="archive-list">
            {archived.map(n => (
              <li key={n.id} data-testid={`note-row-${n.id}`}>
                {n.title}
                <button data-testid={`unarchive-note-${n.id}`} onClick={() => setArchived(n.id, false)}>Unarchive</button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
