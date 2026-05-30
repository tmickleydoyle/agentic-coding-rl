'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Game, Route, Theme } from '../lib/types'

type AppApi = {
  game: Game
  best: number | null
  theme: Theme
  route: Route
  symbols: string[]
  pendingMismatch: boolean
  pick: (id: string) => void
  clear: () => void
  reset: () => void
  resetBest: () => void
  setSymbols: (list: string[]) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  game: { cards: [], moves: 0, matches: 0, firstPick: null },
  best: null,
  theme: 'light',
  route: 'play',
  symbols: ['A', 'B', 'C', 'D'],
  pendingMismatch: false,
  pick: () => {},
  clear: () => {},
  reset: () => {},
  resetBest: () => {},
  setSymbols: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold game/best/theme/route/symbols in state (seed a 4-pair deck). Implement pick
  // (flip + schedule an 800ms clear on mismatch + best on win), clear, reset, resetBest,
  // setSymbols (fresh game), navigate. The STUB makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
