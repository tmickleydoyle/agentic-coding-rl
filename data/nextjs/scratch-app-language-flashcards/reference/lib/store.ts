import type { Deck, Card } from './types';

let decks: Deck[] = [
  { id: 'd1', name: 'Spanish Basics', language: 'Spanish', sessionsCompleted: 0, lastKnownCount: 0 },
  { id: 'd2', name: 'French Colors', language: 'French', sessionsCompleted: 0, lastKnownCount: 0 },
];
let cards: Card[] = [
  { id: 'c1', deckId: 'd1', front: 'Hello', back: 'Hola' },
  { id: 'c2', deckId: 'd1', front: 'Thank you', back: 'Gracias' },
  { id: 'c3', deckId: 'd2', front: 'Red', back: 'Rouge' },
];
let nextId = 100;

export function __reset() {
  decks = [
    { id: 'd1', name: 'Spanish Basics', language: 'Spanish', sessionsCompleted: 0, lastKnownCount: 0 },
    { id: 'd2', name: 'French Colors', language: 'French', sessionsCompleted: 0, lastKnownCount: 0 },
  ];
  cards = [
    { id: 'c1', deckId: 'd1', front: 'Hello', back: 'Hola' },
    { id: 'c2', deckId: 'd1', front: 'Thank you', back: 'Gracias' },
    { id: 'c3', deckId: 'd2', front: 'Red', back: 'Rouge' },
  ];
  nextId = 100;
}

export function getDecks() { return decks; }
export function getCards() { return cards; }

export function addDeck(data: Pick<Deck, 'name' | 'language'>): Deck {
  const d: Deck = { id: `d${nextId++}`, ...data, sessionsCompleted: 0, lastKnownCount: 0 };
  decks = [...decks, d];
  return d;
}
export function deleteDeck(id: string) {
  cards = cards.filter(c => c.deckId !== id);
  decks = decks.filter(d => d.id !== id);
}

export function addCard(data: Omit<Card, 'id'>): Card {
  const c: Card = { id: `c${nextId++}`, ...data };
  cards = [...cards, c];
  return c;
}
export function deleteCard(id: string) { cards = cards.filter(c => c.id !== id); }

export function recordSession(deckId: string, knownCount: number) {
  decks = decks.map(d => d.id === deckId ? { ...d, sessionsCompleted: d.sessionsCompleted + 1, lastKnownCount: knownCount } : d);
}
