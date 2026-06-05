'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Post, Route, PostStatus, Platform } from '../lib/types'

const STATUS_CYCLE: PostStatus[] = ['draft', 'scheduled', 'published']

const INITIAL_POSTS: Post[] = [
  { id: 1, title: 'Launch announcement', platform: 'Twitter', status: 'scheduled' },
  { id: 2, title: 'Case study', platform: 'LinkedIn', status: 'draft' },
  { id: 3, title: 'Product photo', platform: 'Instagram', status: 'published' },
]

type Ctx = {
  posts: Post[]
  filter: PostStatus | 'all'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addPost: (title: string, platform: Platform, status: PostStatus) => void
  deletePost: (id: number) => void
  toggleStatus: (id: number) => void
  setFilter: (f: PostStatus | 'all') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)
  const [filter, setFilter] = useState<PostStatus | 'all'>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('posts')
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

  function toggleStatus(id: number) {
    setPosts((p) =>
      p.map((x) => {
        if (x.id !== id) return x
        const idx = STATUS_CYCLE.indexOf(x.status)
        const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
        return { ...x, status: next }
      }),
    )
  }

  const value: Ctx = {
    posts,
    filter,
    theme,
    route,
    navigate: setRoute,
    addPost,
    deletePost,
    toggleStatus,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
