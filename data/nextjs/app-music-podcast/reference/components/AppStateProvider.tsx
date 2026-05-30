'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_SHOWS: Show[] = [
  {
    id: 'sh1',
    title: 'Tech Talk',
    category: 'tech',
    subscribed: true,
    episodes: [
      { id: 'e1', title: 'Intro', durationMin: 30, played: true },
      { id: 'e2', title: 'Deep Dive', durationMin: 45, played: false },
    ],
  },
  {
    id: 'sh2',
    title: 'Daily News',
    category: 'news',
    subscribed: false,
    episodes: [{ id: 'e3', title: 'Monday', durationMin: 15, played: false }],
  },
  {
    id: 'sh3',
    title: 'Code Cast',
    category: 'tech',
    subscribed: false,
    episodes: [
      { id: 'e4', title: 'Rust', durationMin: 50, played: false },
      { id: 'e5', title: 'Go', durationMin: 40, played: true },
    ],
  },
]

function setEpisodePlayed(shows: Show[], showId: string, episodeId: string, played: boolean): Show[] {
  return shows.map((s) =>
    s.id === showId
      ? {
          ...s,
          episodes: s.episodes.map((e) => (e.id === episodeId ? { ...e, played } : e)),
        }
      : s,
  )
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [shows, setShows] = useState<Show[]>(SEED_SHOWS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('shows')
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null)
  const [queue, setQueue] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const toggleSubscribe = (showId: string) => {
      setShows((prev) =>
        prev.map((s) => (s.id === showId ? { ...s, subscribed: !s.subscribed } : s)),
      )
    }

    const markPlayed = (showId: string, episodeId: string) => {
      setShows((prev) => setEpisodePlayed(prev, showId, episodeId, true))
    }

    const markUnplayed = (showId: string, episodeId: string) => {
      setShows((prev) => setEpisodePlayed(prev, showId, episodeId, false))
    }

    const enqueue = (episodeId: string) => {
      setQueue((prev) => (prev.includes(episodeId) ? prev : [...prev, episodeId]))
    }

    const dequeue = (episodeId: string) => {
      setQueue((prev) => prev.filter((id) => id !== episodeId))
    }

    const openShow = (id: string) => {
      setSelectedShowId(id)
      setRoute('show-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      shows,
      theme,
      route,
      selectedShowId,
      queue,
      categoryFilter,
      toggleSubscribe,
      markPlayed,
      markUnplayed,
      enqueue,
      dequeue,
      openShow,
      setCategoryFilter,
      setTheme,
      navigate,
    }
  }, [shows, theme, route, selectedShowId, queue, categoryFilter])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
