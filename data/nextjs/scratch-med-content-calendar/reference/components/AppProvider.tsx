'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Post, Platform, PostStatus, Route } from '../lib/types'

const INITIAL_POSTS: Post[] = [
  { id: 1, title: 'Launch announcement', platform: 'Twitter', status: 'Published' },
  { id: 2, title: 'Product demo', platform: 'LinkedIn', status: 'Scheduled' },
  { id: 3, title: 'Behind the scenes', platform: 'Instagram', status: 'Draft' },
]

type Ctx = {
  posts: Post[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addPost: (title: string, platform: Platform, status: PostStatus) => void
  deletePost: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('calendar')
  const [nextId, setNextId] = useState(4)

  function addPost(title: string, platform: Platform, status: PostStatus) {
    const t = title.trim()
    if (!t) return
    setPosts((p) => [...p, { id: nextId, title: t, platform, status }])
    setNextId((n) => n + 1)
  }

  function deletePost(id: number) {
    setPosts((p) => p.filter((x) => x.id !== id))
  }

  const value: Ctx = {
    posts,
    theme,
    route,
    navigate: setRoute,
    addPost,
    deletePost,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
