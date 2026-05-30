'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_PROFILES: Profile[] = [
  { id: 'u1', name: 'Mia', bio: 'Builder of things' },
  { id: 'u2', name: 'Omar', bio: 'Designer' },
  { id: 'u3', name: 'Zoe', bio: 'Writer' },
  { id: 'u4', name: 'Kai', bio: 'Hacker' },
]

const SEED_POSTS: Post[] = [
  { id: 'p1', authorId: 'u1', text: 'First post' },
  { id: 'p2', authorId: 'u1', text: 'Hello followers' },
  { id: 'p3', authorId: 'u2', text: 'Design tips' },
]

const ME_ID = 'u1'

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(SEED_PROFILES)
  const [posts] = useState<Post[]>(SEED_POSTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('profile')
  const [following, setFollowing] = useState<string[]>(['u2', 'u3'])
  const [followers] = useState<string[]>(['u2', 'u4'])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const toggleFollow = (userId: string) => {
      if (userId === ME_ID) return
      setFollowing((prev) =>
        prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
      )
    }

    const updateProfile = (id: string, patch: { name: string; bio: string }) => {
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: patch.name, bio: patch.bio } : p)),
      )
    }

    const viewUser = (userId: string) => {
      setSelectedUserId(userId)
      setRoute('profile')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      profiles,
      posts,
      theme,
      route,
      meId: ME_ID,
      following,
      followers,
      selectedUserId,
      toggleFollow,
      updateProfile,
      setTheme,
      viewUser,
      navigate,
    }
  }, [profiles, posts, theme, route, following, followers, selectedUserId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
