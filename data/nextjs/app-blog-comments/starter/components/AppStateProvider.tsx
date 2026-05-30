'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  posts: [],
  comments: [],
  theme: 'light',
  route: 'posts',
  statusFilter: 'all',
  selectedPostId: null,
  setStatus: () => {},
  removeComment: () => {},
  setStatusFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
  openPost: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold posts/comments/theme/route/statusFilter/selectedPostId in state (seed 2 posts +
  // 4 comments), implement setStatus/removeComment + setters + navigate + openPost, and provide
  // them through AppContext. The STUB makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
