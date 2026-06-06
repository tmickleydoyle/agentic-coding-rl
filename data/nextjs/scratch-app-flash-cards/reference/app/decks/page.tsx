'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function DecksPage() {
  const { decks, cards, addDeck, deleteDeck, addCard, deleteCard } = useApp();
  const [deckName, setDeckName] = useState('');
  const [deckDesc, setDeckDesc] = useState('');
  const [deckError, setDeckError] = useState('');
  const [selectedDeck, setSelectedDeck] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [cardError, setCardError] = useState('');

  const handleAddDeck = () => {
    if (!deckName.trim()) { setDeckError('Name required'); return; }
    const ok = addDeck(deckName, deckDesc);
    if (!ok) { setDeckError('Failed to add deck'); return; }
    setDeckName(''); setDeckDesc(''); setDeckError('');
  };

  const handleAddCard = () => {
    if (!selectedDeck) { setCardError('Select a deck'); return; }
    if (!front.trim() || !back.trim()) { setCardError('Front and back required'); return; }
    const ok = addCard(selectedDeck, front, back);
    if (!ok) { setCardError('Failed'); return; }
    setFront(''); setBack(''); setCardError('');
  };

  return (
    <main data-testid="decks-page">
      <h2>Decks</h2>
      <div data-testid="add-deck-form">
        <input data-testid="deck-name-input" value={deckName} onChange={e => setDeckName(e.target.value)} placeholder="Deck name" />
        <input data-testid="deck-desc-input" value={deckDesc} onChange={e => setDeckDesc(e.target.value)} placeholder="Description" />
        <button data-testid="add-deck-btn" onClick={handleAddDeck}>Add Deck</button>
        {deckError && <span data-testid="deck-error">{deckError}</span>}
      </div>
      <ul data-testid="decks-list">
        {decks.map(d => (
          <li key={d.id} data-testid={`deck-item-${d.id}`}>
            <span data-testid={`deck-name-${d.id}`}>{d.name}</span>
            <span data-testid={`deck-card-count-${d.id}`}>{cards.filter(c => c.deckId === d.id).length} cards</span>
            <button data-testid={`delete-deck-${d.id}`} onClick={() => deleteDeck(d.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div data-testid="add-card-form">
        <select data-testid="card-deck-select" value={selectedDeck} onChange={e => setSelectedDeck(e.target.value)}>
          <option value="">-- Select Deck --</option>
          {decks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input data-testid="card-front-input" value={front} onChange={e => setFront(e.target.value)} placeholder="Front" />
        <input data-testid="card-back-input" value={back} onChange={e => setBack(e.target.value)} placeholder="Back" />
        <button data-testid="add-card-btn" onClick={handleAddCard}>Add Card</button>
        {cardError && <span data-testid="card-error">{cardError}</span>}
      </div>
      <ul data-testid="cards-list">
        {cards.map(c => (
          <li key={c.id} data-testid={`card-item-${c.id}`}>
            <span data-testid={`card-front-${c.id}`}>{c.front}</span>
            <span data-testid={`card-back-${c.id}`}>{c.back}</span>
            <button data-testid={`delete-card-${c.id}`} onClick={() => deleteCard(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
