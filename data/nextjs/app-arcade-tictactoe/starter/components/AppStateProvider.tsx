'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Board, Outcome, Player, Route, Theme } from '../lib/types'

type Tally = { x: number; o: number; draws: number }

type AppApi = {
  board: Board
  current: Player
  result: Outcome
  tally: Tally
  theme: Theme
  route: Route
  aiStarts: boolean
  play: (index: number) => void
  reset: () => void
  resetTally: () => void
  setAiStarts: (value: boolean) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  board: [null, null, null, null, null, null, null, null, null],
  current: 'X',
  result: null,
  tally: { x: 0, o: 0, draws: 0 },
  theme: 'light',
  route: 'play',
  aiStarts: false,
  play: () => {},
  reset: () => {},
  resetTally: () => {},
  setAiStarts: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold board/current/result/tally/theme/route/aiStarts in state. Implement play
  // (human X then deterministic AI O, tally once on game over), reset (optionally AI opens),
  // resetTally, setAiStarts, navigate. The STUB makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
