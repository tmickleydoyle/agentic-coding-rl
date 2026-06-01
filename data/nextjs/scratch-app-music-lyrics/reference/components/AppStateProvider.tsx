'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_SONGS: Song[] = [
  { id: 'g1', title: 'Open Road', artist: 'Aria', lines: ['We ride at dawn', 'Chasing the sun', 'Open road ahead'] },
  { id: 'g2', title: 'Quiet Sea', artist: 'Aria', lines: ['Waves roll slow', 'Quiet sea at night'] },
  { id: 'g3', title: 'City Lights', artist: 'Echo', lines: ['Neon city lights', 'Dancing in the rain', 'Lost in the sound'] },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [songs] = useState<Song[]>(SEED_SONGS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('songs')
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null)
  const [favoriteLines, setFavoriteLines] = useState<FavoriteLine[]>([])
  const [artistFilter, setArtistFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const value = useMemo<AppApi>(() => {
    const isLineFavorite = (songId: string, lineIndex: number) =>
      favoriteLines.some((f) => f.songId === songId && f.lineIndex === lineIndex)

    const toggleFavoriteLine = (songId: string, lineIndex: number) => {
      setFavoriteLines((prev) => {
        const exists = prev.some((f) => f.songId === songId && f.lineIndex === lineIndex)
        if (exists) {
          return prev.filter((f) => !(f.songId === songId && f.lineIndex === lineIndex))
        }
        return [...prev, { songId, lineIndex }]
      })
    }

    const openSong = (id: string) => {
      setSelectedSongId(id)
      setRoute('song-detail')
    }

    const openArtist = (artist: string) => {
      setArtistFilter(artist)
      setRoute('songs')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      songs,
      theme,
      route,
      selectedSongId,
      favoriteLines,
      artistFilter,
      searchQuery,
      toggleFavoriteLine,
      isLineFavorite,
      openSong,
      openArtist,
      setArtistFilter,
      setSearchQuery,
      setTheme,
      navigate,
    }
  }, [songs, theme, route, selectedSongId, favoriteLines, artistFilter, searchQuery])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
