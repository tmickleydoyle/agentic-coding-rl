'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Video, Route, Theme } from '../lib/types'

type AppApi = {
  videos: Video[]
  theme: Theme
  route: Route
  watchedIds: string[]
  watchlistIds: string[]
  selectedVideoId: string | null
  isWatched: (videoId: string) => boolean
  inWatchlist: (videoId: string) => boolean
  openVideo: (videoId: string) => void
  markWatched: (videoId: string) => void
  toggleWatchlist: (videoId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  videos: [],
  theme: 'light',
  route: 'browse',
  watchedIds: [],
  watchlistIds: [],
  selectedVideoId: null,
  isWatched: () => false,
  inWatchlist: () => false,
  openVideo: () => {},
  markWatched: () => {},
  toggleWatchlist: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold videos/watchedIds/watchlistIds/theme/route/selectedVideoId in state (seed
  // videos via seedVideos()), implement the actions, and provide them through AppContext.
  // The STUB below makes the app mount but does nothing — replace it with real state.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
