'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Card, Deck, Route, Theme } from '../lib/types'

type NewCardInput = { deckId: string; front: string; back: string }

type AppApi = {
  decks: Deck[]
  cards: Card[]
  theme: Theme
  route: Route
  selectedDeckId: string | null
  studyIndex: number
  flipped: boolean
  addCard: (input: NewCardInput) => Card
  markKnown: (id: string, known: boolean) => void
  flip: () => void
  nextCard: () => void
  resetDeck: (deckId: string) => void
  studyDeck: (id: string) => void
  startAddCard: (deckId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  decks: [],
  cards: [],
  theme: 'light',
  route: 'decks',
  selectedDeckId: null,
  studyIndex: 0,
  flipped: false,
  addCard: () => ({ id: '', deckId: '', front: '', back: '', known: false }),
  markKnown: () => {},
  flip: () => {},
  nextCard: () => {},
  resetDeck: () => {},
  studyDeck: () => {},
  startAddCard: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold decks/cards/theme/route/selection/study state (seed 2 decks + 4 cards),
  // implement the actions, and provide them through AppContext. Replace the STUB.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
