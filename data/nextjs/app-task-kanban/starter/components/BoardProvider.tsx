'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Card, Route, Theme } from '../lib/types'

type BoardApi = {
  cards: Card[]
  theme: Theme
  route: Route
  wipLimit: number
  addCard: (title: string) => void
  moveForward: (id: string) => void
  moveBack: (id: string) => void
  deleteCard: (id: string) => void
  archiveCard: (id: string) => void
  restoreCard: (id: string) => void
  setWipLimit: (n: number) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const BoardContext = createContext<BoardApi | null>(null)

const STUB: BoardApi = {
  cards: [],
  theme: 'light',
  route: 'board',
  wipLimit: 3,
  addCard: () => {},
  moveForward: () => {},
  moveBack: () => {},
  deleteCard: () => {},
  archiveCard: () => {},
  restoreCard: () => {},
  setWipLimit: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function BoardProvider({ children }: { children: ReactNode }) {
  // TODO: hold cards/theme/route/wipLimit in state (seed 4 cards, wipLimit 3), implement
  // the actions, and provide them through BoardContext. The STUB below makes the app
  // mount but does nothing — replace it with real state + actions.
  return <BoardContext.Provider value={STUB}>{children}</BoardContext.Provider>
}

export function useBoard(): BoardApi {
  const v = useContext(BoardContext)
  if (!v) throw new Error('useBoard must be used within a BoardProvider')
  return v
}
