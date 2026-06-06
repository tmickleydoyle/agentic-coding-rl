import { Deck, Card } from './types';

export function getDecks(): Deck[] { return []; }
export function addDeck(_name: string, _description: string): Deck { throw new Error('Not implemented'); }
export function deleteDeck(_id: string): void {}
export function getCards(_deckId?: string): Card[] { return []; }
export function addCard(_deckId: string, _front: string, _back: string): Card { throw new Error('Not implemented'); }
export function deleteCard(_id: string): void {}
export function __reset(): void {}
