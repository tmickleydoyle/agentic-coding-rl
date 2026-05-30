'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { FavoriteLine, Route, Song, Theme } from '../lib/types'

type AppApi = {
  songs: Song[]
  theme: Theme
  route: Route
  selectedSongId: string | null
  favoriteLines: FavoriteLine[]
  artistFilter: string | null
  searchQuery: string
  toggleFavoriteLine: (songId: string, lineIndex: number) => void
  isLineFavorite: (songId: string, lineIndex: number) => boolean
  openSong: (id: string) => void
  openArtist: (artist: string) => void
  setArtistFilter: (artist: string | null) => void
  setSearchQuery: (q: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  songs: [],
  theme: 'light',
  route: 'songs',
  selectedSongId: null,
  favoriteLines: [],
  artistFilter: null,
  searchQuery: '',
  toggleFavoriteLine: () => {},
  isLineFavorite: () => false,
  openSong: () => {},
  openArtist: () => {},
  setArtistFilter: () => {},
  setSearchQuery: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold songs/theme/route/selection/favoriteLines/artistFilter/search in state
  // (seed 3 songs), implement the actions, and provide them. Replace the STUB.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
