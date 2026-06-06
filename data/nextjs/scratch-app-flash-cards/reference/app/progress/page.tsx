'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ProgressPage() {
  const { decks, cards, sessions } = useApp();

  return (
    <main data-testid="progress-page">
      <h2>Progress</h2>
      <ul data-testid="progress-list">
        {decks.map(d => {
          const deckCards = cards.filter(c => c.deckId === d.id);
          const lastSession = sessions.filter(s => s.deckId === d.id).slice(-1)[0];
          return (
            <li key={d.id} data-testid={`progress-deck-${d.id}`}>
              <span data-testid={`progress-deck-name-${d.id}`}>{d.name}</span>
              <span data-testid={`progress-card-count-${d.id}`}>{deckCards.length} cards</span>
              {lastSession ? (
                <>
                  <span data-testid={`progress-correct-${d.id}`}>{lastSession.correct} correct</span>
                  <span data-testid={`progress-incorrect-${d.id}`}>{lastSession.incorrect} incorrect</span>
                </>
              ) : (
                <span data-testid={`progress-no-session-${d.id}`}>No sessions yet</span>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
