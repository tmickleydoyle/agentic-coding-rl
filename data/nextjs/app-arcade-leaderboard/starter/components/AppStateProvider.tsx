'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Game, Score, Route, Theme } from '../lib/types'

type AppApi = {
  games: Game[]
  scores: Score[]
  theme: Theme
  route: Route
  selectedGameId: string | null
  submitScore: (gameId: string, player: string, points: number) => string | null
  openGame: (gameId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  games: [],
  scores: [],
  theme: 'light',
  route: 'games',
  selectedGameId: null,
  submitScore: () => null,
  openGame: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold games/scores/theme/route/selection in state (seed 3 games + 6 scores),
  // implement submitScore (validated, ids s7+), openGame/navigate, and provide them through
  // AppContext. The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
