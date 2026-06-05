'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Channel, Route, SortKey, Theme, Video } from '../lib/types'
import { seedChannels, seedVideos } from '../lib/seed'

type AppApi = {
  channels: Channel[]
  videos: Video[]
  theme: Theme
  route: Route
  subscribedIds: string[]
  viewCounts: Record<string, number>
  selectedChannelId: string | null
  selectedVideoId: string | null
  sort: SortKey
  isSubscribed: (channelId: string) => boolean
  viewsFor: (videoId: string) => number
  openChannel: (channelId: string) => void
  openVideo: (videoId: string) => void
  toggleSubscribe: (channelId: string) => void
  recordView: (videoId: string) => void
  setSort: (sort: SortKey) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [channels] = useState<Channel[]>(() => seedChannels())
  const [videos] = useState<Video[]>(() => seedVideos())
  const [subscribedIds, setSubscribedIds] = useState<string[]>([])
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({})
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('channel')
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>('ch1')
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('recent')

  const value = useMemo<AppApi>(() => {
    const isSubscribed = (channelId: string) => subscribedIds.includes(channelId)

    const viewsFor = (videoId: string) => {
      const base = videos.find((v) => v.id === videoId)?.views ?? 0
      return base + (viewCounts[videoId] ?? 0)
    }

    const openChannel = (channelId: string) => {
      setSelectedChannelId(channelId)
      setRoute('channel')
    }

    const openVideo = (videoId: string) => {
      setSelectedVideoId(videoId)
      setRoute('video-detail')
    }

    const toggleSubscribe = (channelId: string) => {
      setSubscribedIds((prev) =>
        prev.includes(channelId)
          ? prev.filter((id) => id !== channelId)
          : [...prev, channelId],
      )
    }

    const recordView = (videoId: string) => {
      setViewCounts((prev) => ({ ...prev, [videoId]: (prev[videoId] ?? 0) + 1 }))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      channels,
      videos,
      theme,
      route,
      subscribedIds,
      viewCounts,
      selectedChannelId,
      selectedVideoId,
      sort,
      isSubscribed,
      viewsFor,
      openChannel,
      openVideo,
      toggleSubscribe,
      recordView,
      setSort,
      setTheme,
      navigate,
    }
  }, [channels, videos, subscribedIds, viewCounts, theme, route, selectedChannelId, selectedVideoId, sort])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
