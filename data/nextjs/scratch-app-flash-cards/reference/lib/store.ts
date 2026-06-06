import { Deck, Card } from './types';

let decks: Deck[] = [
  { id: 'd1', name: 'Spanish Basics', description: 'Common Spanish words' },
  { id: 'd2', name: 'History Dates', description: 'Key historical events' },
];

let cards: Card[] = [
  { id: 'c1', deckId: 'd1', front: 'Hola', back: 'Hello' },
  { id: 'c2', deckId: 'd1', front: 'Gracias', back: 'Thank you' },
  { id: 'c3', deckId: 'd2', front: '1776', back: 'US Independence' },
];

let nextDeckId = 3;
let nextCardId = 4;

export function getDecks(): Deck[] { return decks; }

export function addDeck(name: string, description: string): Deck {
  if (!name.trim()) throw new Error('Name required');
  const deck: Deck = { id: `d${nextDeckId++}`, name: name.trim(), description };
  decks.push(deck);
  return deck;
}

export function deleteDeck(id: string): void {
  decks = decks.filter(d => d.id !== id);
  cards = cards.filter(c => c.deckId !== id);
}

export function getCards(deckId?: string): Card[] {
  return deckId ? cards.filter(c => c.deckId === deckId) : cards;
}

export function addCard(deckId: string, front: string, back: string): Card {
  if (!front.trim() || !back.trim()) throw new Error('Front and back required');
  const card: Card = { id: `c${nextCardId++}`, deckId, front: front.trim(), back: back.trim() };
  cards.push(card);
  return card;
}

export function deleteCard(id: string): void {
  cards = cards.filter(c => c.id !== id);
}

export function __reset(): void {
  decks = [
    { id: 'd1', name: 'Spanish Basics', description: 'Common Spanish words' },
    { id: 'd2', name: 'History Dates', description: 'Key historical events' },
  ];
  cards = [
    { id: 'c1', deckId: 'd1', front: 'Hola', back: 'Hello' },
    { id: 'c2', deckId: 'd1', front: 'Gracias', back: 'Thank you' },
    { id: 'c3', deckId: 'd2', front: '1776', back: 'US Independence' },
  ];
  nextDeckId = 3;
  nextCardId = 4;
}
