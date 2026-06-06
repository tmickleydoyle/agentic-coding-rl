'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import type { Deck, Card } from '../../lib/types';

export function DecksPage() {
  const { decks, setDecks, cards, setCards } = useApp();
  const [deckName, setDeckName] = useState('');
  const [lang, setLang] = useState('');
  const [fronts, setFronts] = useState<Record<string, string>>({});
  const [backs, setBacks] = useState<Record<string, string>>({});

  function handleAddDeck(e: React.FormEvent) {
    e.preventDefault();
    if (!deckName.trim() || !lang.trim()) return;
    const d: Deck = { id: `d${Date.now()}`, name: deckName.trim(), language: lang.trim(), sessionsCompleted: 0, lastKnownCount: 0 };
    setDecks(prev => [...prev, d]);
    setDeckName(''); setLang('');
  }

  function handleDeleteDeck(id: string) {
    setCards(prev => prev.filter(c => c.deckId !== id));
    setDecks(prev => prev.filter(d => d.id !== id));
  }

  function handleAddCard(e: React.FormEvent, deckId: string) {
    e.preventDefault();
    const front = fronts[deckId] || '';
    const back = backs[deckId] || '';
    if (!front.trim() || !back.trim()) return;
    const c: Card = { id: `c${Date.now()}`, deckId, front: front.trim(), back: back.trim() };
    setCards(prev => [...prev, c]);
    setFronts(prev => ({ ...prev, [deckId]: '' }));
    setBacks(prev => ({ ...prev, [deckId]: '' }));
  }

  return (
    <div>
      <h2>Decks</h2>
      <form data-testid="deck-add-form" onSubmit={handleAddDeck}>
        <input data-testid="deck-name-input" value={deckName} onChange={e => setDeckName(e.target.value)} placeholder="Deck name" />
        <input data-testid="deck-lang-input" value={lang} onChange={e => setLang(e.target.value)} placeholder="Language" />
        <button data-testid="deck-submit" type="submit">Add Deck</button>
      </form>
      <ul data-testid="deck-list">
        {decks.map(d => {
          const deckCards = cards.filter(c => c.deckId === d.id);
          return (
            <li key={d.id} data-testid="deck-item">
              <span>{d.name}</span>
              <span>{d.language}</span>
              <button data-testid="deck-delete" onClick={() => handleDeleteDeck(d.id)}>Delete</button>
              <form data-testid="card-add-form" onSubmit={e => handleAddCard(e, d.id)}>
                <input data-testid="card-front-input" value={fronts[d.id] || ''} onChange={e => setFronts(prev => ({ ...prev, [d.id]: e.target.value }))} placeholder="Front" />
                <input data-testid="card-back-input" value={backs[d.id] || ''} onChange={e => setBacks(prev => ({ ...prev, [d.id]: e.target.value }))} placeholder="Back" />
                <button data-testid="card-submit" type="submit">Add Card</button>
              </form>
              <ul data-testid="card-list">
                {deckCards.map(c => (
                  <li key={c.id} data-testid="card-item">
                    <span>{c.front}</span>
                    <button data-testid="card-delete" onClick={() => setCards(prev => prev.filter(x => x.id !== c.id))}>Delete</button>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
