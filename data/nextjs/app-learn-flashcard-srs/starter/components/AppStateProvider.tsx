'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Deck, Grade, Route, Theme } from '../lib/types'

type AppApi = {
  decks: Deck[]
  theme: Theme
  route: Route
  activeDeckId: string | null
  openDeck: (deckId: string) => void
  gradeCard: (deckId: string, cardId: string, grade: Grade) => void
  addCard: (deckId: string, input: { front: string; back: string }) => void
  setActiveDeck: (deckId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  decks: [],
  theme: 'light',
  route: 'decks',
  activeDeckId: null,
  openDeck: () => {},
  gradeCard: () => {},
  addCard: () => {},
  setActiveDeck: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold decks/theme/route/activeDeckId in state (seed via seedDecks()), implement
  // the actions (use reschedule from lib/srs), and provide them through AppContext. The
  // STUB below makes the app mount but does nothing — replace it with real state.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
