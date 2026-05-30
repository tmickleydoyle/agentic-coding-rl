'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Clip, Route, Theme } from '../lib/types'

type AppApi = {
  clips: Clip[]
  theme: Theme
  route: Route
  likedIds: string[]
  savedIds: string[]
  activeCategory: string | null
  selectedClipId: string | null
  isLiked: (clipId: string) => boolean
  isSaved: (clipId: string) => boolean
  likesFor: (clipId: string) => number
  openClip: (clipId: string) => void
  toggleLike: (clipId: string) => void
  toggleSave: (clipId: string) => void
  setCategory: (category: string | null) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  clips: [],
  theme: 'light',
  route: 'feed',
  likedIds: [],
  savedIds: [],
  activeCategory: null,
  selectedClipId: null,
  isLiked: () => false,
  isSaved: () => false,
  likesFor: () => 0,
  openClip: () => {},
  toggleLike: () => {},
  toggleSave: () => {},
  setCategory: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold clips/likedIds/savedIds/activeCategory/theme/route/selectedClipId in state
  // (seed clips via seedClips()), implement the actions, and provide them via AppContext.
  // The STUB below mounts the app but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
