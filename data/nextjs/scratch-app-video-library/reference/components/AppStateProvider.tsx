'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Video, Route, Theme } from '../lib/types'
import { seedVideos } from '../lib/seed'

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

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [videos] = useState<Video[]>(() => seedVideos())
  const [watchedIds, setWatchedIds] = useState<string[]>([])
  const [watchlistIds, setWatchlistIds] = useState<string[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('browse')
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const isWatched = (videoId: string) => watchedIds.includes(videoId)
    const inWatchlist = (videoId: string) => watchlistIds.includes(videoId)

    const openVideo = (videoId: string) => {
      setSelectedVideoId(videoId)
      setRoute('video-detail')
    }

    const markWatched = (videoId: string) => {
      setWatchedIds((prev) =>
        prev.includes(videoId) ? prev : [videoId, ...prev],
      )
    }

    const toggleWatchlist = (videoId: string) => {
      setWatchlistIds((prev) =>
        prev.includes(videoId)
          ? prev.filter((id) => id !== videoId)
          : [...prev, videoId],
      )
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      videos,
      theme,
      route,
      watchedIds,
      watchlistIds,
      selectedVideoId,
      isWatched,
      inWatchlist,
      openVideo,
      markWatched,
      toggleWatchlist,
      setTheme,
      navigate,
    }
  }, [videos, watchedIds, watchlistIds, theme, route, selectedVideoId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
