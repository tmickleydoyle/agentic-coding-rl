'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Album, Route, Theme } from '../lib/types'

type AppApi = {
  albums: Album[]
  theme: Theme
  route: Route
  selectedAlbumId: string | null
  artistFilter: string | null
  toggleFavorite: (albumId: string) => void
  rateAlbum: (albumId: string, rating: number) => void
  openAlbum: (id: string) => void
  openArtist: (artist: string) => void
  setArtistFilter: (artist: string | null) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  albums: [],
  theme: 'light',
  route: 'albums',
  selectedAlbumId: null,
  artistFilter: null,
  toggleFavorite: () => {},
  rateAlbum: () => {},
  openAlbum: () => {},
  openArtist: () => {},
  setArtistFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold albums/theme/route/selection/artistFilter in state (seed 4 albums),
  // implement the actions, and provide them through AppContext. Replace the STUB.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
