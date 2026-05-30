'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Route, Show, Theme } from '../lib/types'

type AppApi = {
  shows: Show[]
  theme: Theme
  route: Route
  selectedShowId: string | null
  queue: string[]
  categoryFilter: string | null
  toggleSubscribe: (showId: string) => void
  markPlayed: (showId: string, episodeId: string) => void
  markUnplayed: (showId: string, episodeId: string) => void
  enqueue: (episodeId: string) => void
  dequeue: (episodeId: string) => void
  openShow: (id: string) => void
  setCategoryFilter: (cat: string | null) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  shows: [],
  theme: 'light',
  route: 'shows',
  selectedShowId: null,
  queue: [],
  categoryFilter: null,
  toggleSubscribe: () => {},
  markPlayed: () => {},
  markUnplayed: () => {},
  enqueue: () => {},
  dequeue: () => {},
  openShow: () => {},
  setCategoryFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold shows/theme/route/selection/queue/categoryFilter in state (seed 3 shows),
  // implement the actions, and provide them through AppContext. Replace the STUB.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
