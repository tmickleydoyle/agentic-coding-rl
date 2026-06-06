'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function StatsPage() {
  const { decks, cards } = useApp();
  return (
    <div>
      <h2>Stats</h2>
      <ul data-testid="stats-list">
        {decks.map(d => {
          const deckCards = cards.filter(c => c.deckId === d.id);
          return (
            <li key={d.id} data-testid="stats-item">
              <span>{d.name}</span>
              <span>{deckCards.length} cards</span>
              <span>{d.sessionsCompleted} sessions</span>
              <span>{d.lastKnownCount} known</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
