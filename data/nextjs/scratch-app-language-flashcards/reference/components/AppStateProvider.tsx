'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Deck, Card, Route } from '../lib/types';

interface AppContextValue {
  route: Route; navigate: (r: Route) => void;
  decks: Deck[]; setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
  cards: Card[]; setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', navigate: () => {},
  decks: [], setDecks: () => {},
  cards: [], setCards: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [decks, setDecks] = useState<Deck[]>([
    { id: 'd1', name: 'Spanish Basics', language: 'Spanish', sessionsCompleted: 0, lastKnownCount: 0 },
    { id: 'd2', name: 'French Colors', language: 'French', sessionsCompleted: 0, lastKnownCount: 0 },
  ]);
  const [cards, setCards] = useState<Card[]>([
    { id: 'c1', deckId: 'd1', front: 'Hello', back: 'Hola' },
    { id: 'c2', deckId: 'd1', front: 'Thank you', back: 'Gracias' },
    { id: 'c3', deckId: 'd2', front: 'Red', back: 'Rouge' },
  ]);
  const navigate = useCallback((r: Route) => setRoute(r), []);
  return (
    <AppContext.Provider value={{ route, navigate, decks, setDecks, cards, setCards }}>
      {children}
    </AppContext.Provider>
  );
}
