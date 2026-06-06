'use client'
import React, { createContext, useContext, useState } from 'react';
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
  route: 'home',
  decks: [],
  cards: [],
  sessions: [],
  navigate: () => {},
  addDeck: () => false,
  deleteDeck: () => {},
  addCard: () => false,
  deleteCard: () => {},
  recordSession: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [decks, setDecks] = useState<Deck[]>([
    { id: 'd1', name: 'Spanish Basics', description: 'Common Spanish words' },
    { id: 'd2', name: 'History Dates', description: 'Key historical events' },
  ]);
  const [cards, setCards] = useState<Card[]>([
    { id: 'c1', deckId: 'd1', front: 'Hola', back: 'Hello' },
    { id: 'c2', deckId: 'd1', front: 'Gracias', back: 'Thank you' },
    { id: 'c3', deckId: 'd2', front: '1776', back: 'US Independence' },
  ]);
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [nextDid, setNextDid] = useState(3);
  const [nextCid, setNextCid] = useState(4);

  const navigate = (r: Route) => setRoute(r);

  const addDeck = (name: string, description: string): boolean => {
    if (!name.trim()) return false;
    setDecks(prev => [...prev, { id: `d${nextDid}`, name: name.trim(), description }]);
    setNextDid(n => n + 1);
    return true;
  };

  const deleteDeck = (id: string) => {
    setDecks(prev => prev.filter(d => d.id !== id));
    setCards(prev => prev.filter(c => c.deckId !== id));
  };

  const addCard = (deckId: string, front: string, back: string): boolean => {
    if (!front.trim() || !back.trim()) return false;
    setCards(prev => [...prev, { id: `c${nextCid}`, deckId, front: front.trim(), back: back.trim() }]);
    setNextCid(n => n + 1);
    return true;
  };

  const deleteCard = (id: string) => setCards(prev => prev.filter(c => c.id !== id));

  const recordSession = (result: SessionResult) => setSessions(prev => [...prev, result]);

  return (
    <AppContext.Provider value={{ route, decks, cards, sessions, navigate, addDeck, deleteDeck, addCard, deleteCard, recordSession }}>
      {children}
    </AppContext.Provider>
  );
}
