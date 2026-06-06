'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function StudyPage() {
  const { decks, setDecks, cards } = useApp();
  const [selectedDeckId, setSelectedDeckId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<string[]>([]);

  const deckCards = cards.filter(c => c.deckId === selectedDeckId);
  const currentCard = deckCards[currentIndex] ?? null;

  function handleDeckSelect(id: string) {
    setSelectedDeckId(id);
    setCurrentIndex(0);
    setFlipped(false);
    setKnownIds([]);
  }

  function handleNext() {
    setCurrentIndex(i => deckCards.length > 0 ? (i + 1) % deckCards.length : 0);
    setFlipped(false);
  }

  function handlePrev() {
    setCurrentIndex(i => deckCards.length > 0 ? (i - 1 + deckCards.length) % deckCards.length : 0);
    setFlipped(false);
  }

  function handleMarkKnown() {
    if (currentCard && !knownIds.includes(currentCard.id)) {
      setKnownIds(prev => [...prev, currentCard.id]);
    }
  }

  function handleEndSession() {
    setDecks(prev => prev.map(d => d.id === selectedDeckId ? { ...d, sessionsCompleted: d.sessionsCompleted + 1, lastKnownCount: knownIds.length } : d));
    setKnownIds([]);
    setCurrentIndex(0);
    setFlipped(false);
  }

  return (
    <div>
      <h2>Study</h2>
      <select data-testid="study-deck-select" value={selectedDeckId} onChange={e => handleDeckSelect(e.target.value)}>
        <option value="">Select deck</option>
        {decks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>
      {currentCard && (
        <div>
          <div data-testid="study-card-front">{currentCard.front}</div>
          {flipped && <div data-testid="study-card-back">{currentCard.back}</div>}
          <div data-testid="study-progress">{knownIds.length}/{deckCards.length}</div>
          <button data-testid="study-flip" onClick={() => setFlipped(f => !f)}>Flip</button>
          <button data-testid="study-prev" onClick={handlePrev}>Prev</button>
          <button data-testid="study-next" onClick={handleNext}>Next</button>
          <button data-testid="study-mark-known" onClick={handleMarkKnown}>Mark Known</button>
          <button data-testid="study-end-session" onClick={handleEndSession}>End Session</button>
        </div>
      )}
    </div>
  );
}
