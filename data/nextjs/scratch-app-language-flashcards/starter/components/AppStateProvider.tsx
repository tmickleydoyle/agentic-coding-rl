'use client';
import React, { createContext, useContext } from 'react';
import type { Deck, Card, Route } from '../lib/types';
interface AppContextValue { route: Route; navigate: (r: Route) => void; decks: Deck[]; setDecks: React.Dispatch<React.SetStateAction<Deck[]>>; cards: Card[]; setCards: React.Dispatch<React.SetStateAction<Card[]>>; }
const AppContext = createContext<AppContextValue>({ route: 'home', navigate: () => {}, decks: [], setDecks: () => {}, cards: [], setCards: () => {} });
export function useApp() { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: 'home', navigate: () => {}, decks: [], setDecks: () => {}, cards: [], setCards: () => {} }}>{children}</AppContext.Provider>;
}
