'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Channel, Route, SortKey, Theme, Video } from '../lib/types'

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

const STUB: AppApi = {
  channels: [],
  videos: [],
  theme: 'light',
  route: 'channel',
  subscribedIds: [],
  viewCounts: {},
  selectedChannelId: null,
  selectedVideoId: null,
  sort: 'recent',
  isSubscribed: () => false,
  viewsFor: () => 0,
  openChannel: () => {},
  openVideo: () => {},
  toggleSubscribe: () => {},
  recordView: () => {},
  setSort: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold channels/videos/subscribedIds/viewCounts/theme/route/selected ids/sort in
  // state (seed via seedChannels()/seedVideos(), selectedChannelId starts 'ch1'), implement
  // the actions, and provide them via AppContext. The STUB below mounts but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
