import type { Deck, Card } from './types';
let decks: Deck[] = []; let cards: Card[] = [];
export function __reset() { decks = []; cards = []; }
export function getDecks() { return decks; }
export function getCards() { return cards; }
export function addDeck(_d: Pick<Deck,'name'|'language'>): Deck { return {} as Deck; }
export function deleteDeck(_id: string) {}
export function addCard(_d: Omit<Card,'id'>): Card { return {} as Card; }
export function deleteCard(_id: string) {}
export function recordSession(_deckId: string, _knownCount: number) {}
