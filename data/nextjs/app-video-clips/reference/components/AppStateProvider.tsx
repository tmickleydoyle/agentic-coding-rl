'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Clip, Route, Theme } from '../lib/types'
import { seedClips } from '../lib/seed'

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

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [clips] = useState<Clip[]>(() => seedClips())
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('feed')
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const isLiked = (clipId: string) => likedIds.includes(clipId)
    const isSaved = (clipId: string) => savedIds.includes(clipId)

    const likesFor = (clipId: string) => {
      const base = clips.find((c) => c.id === clipId)?.likes ?? 0
      return base + (likedIds.includes(clipId) ? 1 : 0)
    }

    const openClip = (clipId: string) => {
      setSelectedClipId(clipId)
      setRoute('clip-detail')
    }

    const toggleLike = (clipId: string) => {
      setLikedIds((prev) =>
        prev.includes(clipId) ? prev.filter((id) => id !== clipId) : [...prev, clipId],
      )
    }

    const toggleSave = (clipId: string) => {
      setSavedIds((prev) =>
        prev.includes(clipId) ? prev.filter((id) => id !== clipId) : [clipId, ...prev],
      )
    }

    const setCategory = (category: string | null) => setActiveCategory(category)

    const navigate = (next: Route) => setRoute(next)

    return {
      clips,
      theme,
      route,
      likedIds,
      savedIds,
      activeCategory,
      selectedClipId,
      isLiked,
      isSaved,
      likesFor,
      openClip,
      toggleLike,
      toggleSave,
      setCategory,
      setTheme,
      navigate,
    }
  }, [clips, likedIds, savedIds, activeCategory, theme, route, selectedClipId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
