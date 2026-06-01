'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_SONGS: Song[] = [
  { id: 's1', title: 'Sunrise', artist: 'Aria', genre: 'pop', durationSec: 210, playCount: 0 },
  { id: 's2', title: 'Night Drive', artist: 'Aria', genre: 'rock', durationSec: 240, playCount: 3 },
  { id: 's3', title: 'Deep Blue', artist: 'Echo', genre: 'jazz', durationSec: 180, playCount: 1 },
  { id: 's4', title: 'Pulse', artist: 'Echo', genre: 'rock', durationSec: 200, playCount: 0 },
]

const SEED_PLAYLISTS: Playlist[] = [
  { id: 'p1', name: 'Favorites', songIds: ['s2'] },
  { id: 'p2', name: 'Chill', songIds: [] },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>(SEED_SONGS)
  const [playlists, setPlaylists] = useState<Playlist[]>(SEED_PLAYLISTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('library')
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [queue, setQueue] = useState<string[]>([])
  const [shuffle, setShuffle] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const value = useMemo<AppApi>(() => {
    const addSongToPlaylist = (playlistId: string, songId: string) => {
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId && !p.songIds.includes(songId)
            ? { ...p, songIds: [...p.songIds, songId] }
            : p,
        ),
      )
    }

    const removeSongFromPlaylist = (playlistId: string, songId: string) => {
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId ? { ...p, songIds: p.songIds.filter((id) => id !== songId) } : p,
        ),
      )
    }

    const enqueue = (songId: string) => {
      setQueue((prev) => (prev.includes(songId) ? prev : [...prev, songId]))
    }

    const dequeue = (songId: string) => {
      setQueue((prev) => prev.filter((id) => id !== songId))
    }

    const playSong = (songId: string) => {
      setSongs((prev) =>
        prev.map((s) => (s.id === songId ? { ...s, playCount: s.playCount + 1 } : s)),
      )
    }

    const toggleShuffle = () => setShuffle((s) => !s)

    const openPlaylist = (id: string) => {
      setSelectedPlaylistId(id)
      setRoute('playlist')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      songs,
      playlists,
      theme,
      route,
      selectedPlaylistId,
      queue,
      shuffle,
      searchQuery,
      addSongToPlaylist,
      removeSongFromPlaylist,
      enqueue,
      dequeue,
      playSong,
      toggleShuffle,
      openPlaylist,
      setSearchQuery,
      setTheme,
      navigate,
    }
  }, [songs, playlists, theme, route, selectedPlaylistId, queue, shuffle, searchQuery])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
