'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { decks, cards, navigate } = useApp();
  return (
    <main data-testid="home-page">
      <h1>Flash Cards</h1>
      <p data-testid="deck-count">{decks.length} deck(s)</p>
      <p data-testid="card-count">{cards.length} card(s)</p>
      <button data-testid="start-studying" onClick={() => navigate('study')}>Start Studying</button>
    </main>
  );
}
