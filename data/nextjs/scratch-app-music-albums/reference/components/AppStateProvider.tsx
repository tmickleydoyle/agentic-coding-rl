'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

function clampRating(n: number): number {
  if (n < 0) return 0
  if (n > 5) return 5
  return n
}

const SEED_ALBUMS: Album[] = [
  {
    id: 'a1',
    title: 'Dawn',
    artist: 'Aria',
    year: 2019,
    favorite: true,
    rating: 5,
    tracks: [
      { id: 't1', title: 'Wake', lengthSec: 200 },
      { id: 't2', title: 'Glow', lengthSec: 180 },
    ],
  },
  {
    id: 'a2',
    title: 'Dusk',
    artist: 'Aria',
    year: 2021,
    favorite: false,
    rating: 0,
    tracks: [{ id: 't3', title: 'Fade', lengthSec: 220 }],
  },
  {
    id: 'a3',
    title: 'Currents',
    artist: 'Echo',
    year: 2018,
    favorite: false,
    rating: 4,
    tracks: [
      { id: 't4', title: 'Tide', lengthSec: 240 },
      { id: 't5', title: 'Drift', lengthSec: 210 },
    ],
  },
  {
    id: 'a4',
    title: 'Signals',
    artist: 'Echo',
    year: 2022,
    favorite: true,
    rating: 0,
    tracks: [{ id: 't6', title: 'Ping', lengthSec: 160 }],
  },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [albums, setAlbums] = useState<Album[]>(SEED_ALBUMS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('albums')
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null)
  const [artistFilter, setArtistFilter] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const toggleFavorite = (albumId: string) => {
      setAlbums((prev) =>
        prev.map((a) => (a.id === albumId ? { ...a, favorite: !a.favorite } : a)),
      )
    }

    const rateAlbum = (albumId: string, rating: number) => {
      setAlbums((prev) =>
        prev.map((a) => (a.id === albumId ? { ...a, rating: clampRating(rating) } : a)),
      )
    }

    const openAlbum = (id: string) => {
      setSelectedAlbumId(id)
      setRoute('album-detail')
    }

    const openArtist = (artist: string) => {
      setArtistFilter(artist)
      setRoute('albums')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      albums,
      theme,
      route,
      selectedAlbumId,
      artistFilter,
      toggleFavorite,
      rateAlbum,
      openAlbum,
      openArtist,
      setArtistFilter,
      setTheme,
      navigate,
    }
  }, [albums, theme, route, selectedAlbumId, artistFilter])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
