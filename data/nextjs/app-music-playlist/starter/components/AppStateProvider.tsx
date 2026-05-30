'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Playlist, Route, Song, Theme } from '../lib/types'

type AppApi = {
  songs: Song[]
  playlists: Playlist[]
  theme: Theme
  route: Route
  selectedPlaylistId: string | null
  queue: string[]
  shuffle: boolean
  searchQuery: string
  addSongToPlaylist: (playlistId: string, songId: string) => void
  removeSongFromPlaylist: (playlistId: string, songId: string) => void
  enqueue: (songId: string) => void
  dequeue: (songId: string) => void
  playSong: (songId: string) => void
  toggleShuffle: () => void
  openPlaylist: (id: string) => void
  setSearchQuery: (q: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  songs: [],
  playlists: [],
  theme: 'light',
  route: 'library',
  selectedPlaylistId: null,
  queue: [],
  shuffle: false,
  searchQuery: '',
  addSongToPlaylist: () => {},
  removeSongFromPlaylist: () => {},
  enqueue: () => {},
  dequeue: () => {},
  playSong: () => {},
  toggleShuffle: () => {},
  openPlaylist: () => {},
  setSearchQuery: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold songs/playlists/theme/route/selection/queue/shuffle/search in state
  // (seed 4 songs + 2 playlists), implement the actions, and provide them. Replace the STUB.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
