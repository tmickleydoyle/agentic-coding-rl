'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function FavoritesPage() {
  const { recipes } = useApp();
  const favs = recipes.filter(r => r.favorite);
  return (
    <div style={{ padding: 24 }}>
      <h1>Favorites</h1>
      {favs.length === 0
        ? <p data-testid="no-favorites">No favorites yet.</p>
        : (
          <ul data-testid="favorites-list">
            {favs.map(r => (
              <li key={r.id} data-testid={`recipe-row-${r.id}`}>{r.title}</li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
