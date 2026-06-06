'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { decks, cards } = useApp();
  const totalSessions = decks.reduce((sum, d) => sum + d.sessionsCompleted, 0);
  return (
    <div>
      <h1>Flashcards</h1>
      <div data-testid="dashboard-deck-count">{decks.length}</div>
      <div data-testid="dashboard-card-count">{cards.length}</div>
      <div data-testid="dashboard-session-count">{totalSessions}</div>
    </div>
  );
}
