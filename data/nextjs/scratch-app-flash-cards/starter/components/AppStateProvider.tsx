'use client'
import React, { createContext, useContext } from 'react';
import { Deck, Card, SessionResult, Route } from '../lib/types';

interface AppState {
  route: Route;
  decks: Deck[];
  cards: Card[];
  sessions: SessionResult[];
  navigate: (r: Route) => void;
  addDeck: (name: string, description: string) => boolean;
  deleteDeck: (id: string) => void;
  addCard: (deckId: string, front: string, back: string) => boolean;
  deleteCard: (id: string) => void;
  recordSession: (result: SessionResult) => void;
}

const AppContext = createContext<AppState>({
  route: 'home', decks: [], cards: [], sessions: [],
  navigate: () => {}, addDeck: () => false, deleteDeck: () => {},
  addCard: () => false, deleteCard: () => {}, recordSession: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{
      route: 'home', decks: [], cards: [], sessions: [],
      navigate: () => {}, addDeck: () => false, deleteDeck: () => {},
      addCard: () => false, deleteCard: () => {}, recordSession: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
