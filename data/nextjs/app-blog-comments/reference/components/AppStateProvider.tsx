'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type {
  Comment,
  CommentStatus,
  Post,
  Route,
  StatusFilter,
  Theme,
} from '../lib/types'

type AppApi = {
  posts: Post[]
  comments: Comment[]
  theme: Theme
  route: Route
  statusFilter: StatusFilter
  selectedPostId: string | null
  setStatus: (id: string, status: CommentStatus) => void
  removeComment: (id: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
  openPost: (postId: string) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_POSTS: Post[] = [
  { id: 'p1', title: 'Getting Started' },
  { id: 'p2', title: 'Advanced Tips' },
]

const SEED_COMMENTS: Comment[] = [
  { id: 'k1', postId: 'p1', author: 'Ada', body: 'Great post!', status: 'approved' },
  { id: 'k2', postId: 'p1', author: 'Spammer', body: 'buy now', status: 'pending' },
  { id: 'k3', postId: 'p2', author: 'Lin', body: 'Thanks', status: 'pending' },
  { id: 'k4', postId: 'p2', author: 'Bot', body: 'cheap pills', status: 'spam' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [posts] = useState<Post[]>(SEED_POSTS)
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('posts')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const setStatus = (id: string, status: CommentStatus) => {
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    }

    const removeComment = (id: string) => {
      setComments((prev) => prev.filter((c) => c.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    const openPost = (postId: string) => {
      setSelectedPostId(postId)
      setRoute('post-detail')
    }

    return {
      posts,
      comments,
      theme,
      route,
      statusFilter,
      selectedPostId,
      setStatus,
      removeComment,
      setStatusFilter,
      setTheme,
      navigate,
      openPost,
    }
  }, [posts, comments, theme, route, statusFilter, selectedPostId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
