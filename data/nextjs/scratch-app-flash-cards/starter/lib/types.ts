export interface Deck {
  id: string;
  name: string;
  description: string;
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
}

export interface SessionResult {
  deckId: string;
  cardsStudied: number;
  correct: number;
  incorrect: number;
}

export type Route = 'home' | 'decks' | 'study' | 'progress';
