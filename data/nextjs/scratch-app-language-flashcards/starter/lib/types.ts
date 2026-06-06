export interface Deck { id: string; name: string; language: string; sessionsCompleted: number; lastKnownCount: number; }
export interface Card { id: string; deckId: string; front: string; back: string; }
export type Route = 'home' | 'decks' | 'study' | 'stats';
