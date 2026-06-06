'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function StudyPage() {
  const { decks, cards, recordSession } = useApp();
  const [selectedDeck, setSelectedDeck] = useState('');
  const [studying, setStudying] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [done, setDone] = useState(false);

  const deckCards = cards.filter(c => c.deckId === selectedDeck);

  const startStudy = () => {
    if (!selectedDeck) return;
    setIndex(0); setFlipped(false); setCorrect(0); setIncorrect(0); setDone(false);
    setStudying(true);
  };

  const handleKnow = () => {
    const newCorrect = correct + 1;
    if (index + 1 >= deckCards.length) {
      recordSession({ deckId: selectedDeck, cardsStudied: deckCards.length, correct: newCorrect, incorrect });
      setCorrect(newCorrect); setDone(true);
    } else {
      setCorrect(newCorrect); setIndex(i => i + 1); setFlipped(false);
    }
  };

  const handleDontKnow = () => {
    const newIncorrect = incorrect + 1;
    if (index + 1 >= deckCards.length) {
      recordSession({ deckId: selectedDeck, cardsStudied: deckCards.length, correct, incorrect: newIncorrect });
      setIncorrect(newIncorrect); setDone(true);
    } else {
      setIncorrect(newIncorrect); setIndex(i => i + 1); setFlipped(false);
    }
  };

  if (!studying) {
    return (
      <main data-testid="study-page">
        <h2>Study</h2>
        <select data-testid="study-deck-select" value={selectedDeck} onChange={e => setSelectedDeck(e.target.value)}>
          <option value="">-- Select Deck --</option>
          {decks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button data-testid="start-study-btn" onClick={startStudy}>Start</button>
      </main>
    );
  }

  if (deckCards.length === 0) {
    return (
      <main data-testid="study-page">
        <p data-testid="no-cards-msg">No cards in this deck</p>
        <button data-testid="back-to-select" onClick={() => setStudying(false)}>Back</button>
      </main>
    );
  }

  if (done) {
    return (
      <main data-testid="study-page">
        <h2>Session Complete!</h2>
        <p data-testid="session-correct">{correct} correct</p>
        <p data-testid="session-incorrect">{incorrect} incorrect</p>
        <button data-testid="study-again-btn" onClick={() => setStudying(false)}>Study Again</button>
      </main>
    );
  }

  const card = deckCards[index];
  return (
    <main data-testid="study-page">
      <p data-testid="card-progress">{index + 1} / {deckCards.length}</p>
      <div data-testid="flash-card">
        <p data-testid="card-front">{card.front}</p>
        {flipped && <p data-testid="card-back">{card.back}</p>}
      </div>
      {!flipped && <button data-testid="flip-btn" onClick={() => setFlipped(true)}>Flip</button>}
      {flipped && (
        <>
          <button data-testid="know-it-btn" onClick={handleKnow}>Know It</button>
          <button data-testid="dont-know-btn" onClick={handleDontKnow}>Don't Know</button>
        </>
      )}
    </main>
  );
}
