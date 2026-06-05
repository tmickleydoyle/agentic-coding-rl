'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Route, Station, Theme } from '../lib/types'

const MAX_HISTORY = 5

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

const SEED_STATIONS: Station[] = [
  { id: 'r1', name: 'Jazz FM', genre: 'jazz', bitrate: 128, favorite: true, playCount: 5 },
  { id: 'r2', name: 'Rock Wave', genre: 'rock', bitrate: 256, favorite: false, playCount: 2 },
  { id: 'r3', name: 'Chill Hub', genre: 'electronic', bitrate: 320, favorite: true, playCount: 0 },
  { id: 'r4', name: 'News 24', genre: 'talk', bitrate: 96, favorite: false, playCount: 8 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [stations, setStations] = useState<Station[]>(SEED_STATIONS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('stations')
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)
  const [nowPlayingId, setNowPlayingId] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [genreFilter, setGenreFilter] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const play = (stationId: string) => {
      setNowPlayingId(stationId)
      setStations((prev) =>
        prev.map((s) => (s.id === stationId ? { ...s, playCount: s.playCount + 1 } : s)),
      )
      setHistory((prev) => {
        const without = prev.filter((id) => id !== stationId)
        return [stationId, ...without].slice(0, MAX_HISTORY)
      })
    }

    const stop = () => setNowPlayingId(null)

    const toggleFavorite = (stationId: string) => {
      setStations((prev) =>
        prev.map((s) => (s.id === stationId ? { ...s, favorite: !s.favorite } : s)),
      )
    }

    const openStation = (id: string) => {
      setSelectedStationId(id)
      setRoute('station-detail')
    }

    const clearHistory = () => setHistory([])

    const navigate = (next: Route) => setRoute(next)

    return {
      stations,
      theme,
      route,
      selectedStationId,
      nowPlayingId,
      history,
      genreFilter,
      play,
      stop,
      toggleFavorite,
      openStation,
      clearHistory,
      setGenreFilter,
      setTheme,
      navigate,
    }
  }, [stations, theme, route, selectedStationId, nowPlayingId, history, genreFilter])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
