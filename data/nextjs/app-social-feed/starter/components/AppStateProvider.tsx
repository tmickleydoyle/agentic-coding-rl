'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Comment, FeedFilter, Post, Route, Theme, User } from '../lib/types'

type AppApi = {
  users: User[]
  posts: Post[]
  comments: Comment[]
  theme: Theme
  route: Route
  feedFilter: FeedFilter
  currentUserId: string
  selectedPostId: string | null
  selectedUserId: string | null
  following: string[]
  toggleLike: (postId: string) => void
  addComment: (postId: string, text: string) => void
  toggleFollow: (userId: string) => void
  setFeedFilter: (filter: FeedFilter) => void
  setTheme: (theme: Theme) => void
  openPost: (postId: string) => void
  openProfile: (userId: string) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  users: [],
  posts: [],
  comments: [],
  theme: 'light',
  route: 'feed',
  feedFilter: 'all',
  currentUserId: 'u1',
  selectedPostId: null,
  selectedUserId: null,
  following: [],
  toggleLike: () => {},
  addComment: () => {},
  toggleFollow: () => {},
  setFeedFilter: () => {},
  setTheme: () => {},
  openPost: () => {},
  openProfile: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold users/posts/comments/theme/route/feedFilter/following/selection in state
  // (seed 3 users + 3 posts + 3 comments), implement the actions, and provide them through
  // AppContext. The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
