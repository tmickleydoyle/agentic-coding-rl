'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Post, Profile, Route, Theme } from '../lib/types'

type AppApi = {
  profiles: Profile[]
  posts: Post[]
  theme: Theme
  route: Route
  meId: string
  following: string[]
  followers: string[]
  selectedUserId: string | null
  toggleFollow: (userId: string) => void
  updateProfile: (id: string, patch: { name: string; bio: string }) => void
  setTheme: (theme: Theme) => void
  viewUser: (userId: string) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  profiles: [],
  posts: [],
  theme: 'light',
  route: 'profile',
  meId: 'u1',
  following: [],
  followers: [],
  selectedUserId: null,
  toggleFollow: () => {},
  updateProfile: () => {},
  setTheme: () => {},
  viewUser: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold profiles/posts/theme/route/following/followers/selection in state
  // (seed 4 profiles + 3 posts), implement the actions, and provide them through
  // AppContext. The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
