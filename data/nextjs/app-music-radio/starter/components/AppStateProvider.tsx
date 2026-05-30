'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Route, Station, Theme } from '../lib/types'

type AppApi = {
  stations: Station[]
  theme: Theme
  route: Route
  selectedStationId: string | null
  nowPlayingId: string | null
  history: string[]
  genreFilter: string | null
  play: (stationId: string) => void
  stop: () => void
  toggleFavorite: (stationId: string) => void
  openStation: (id: string) => void
  clearHistory: () => void
  setGenreFilter: (genre: string | null) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  stations: [],
  theme: 'light',
  route: 'stations',
  selectedStationId: null,
  nowPlayingId: null,
  history: [],
  genreFilter: null,
  play: () => {},
  stop: () => {},
  toggleFavorite: () => {},
  openStation: () => {},
  clearHistory: () => {},
  setGenreFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold stations/theme/route/selection/nowPlaying/history/genreFilter in state
  // (seed 4 stations), implement the actions, and provide them. Replace the STUB.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
