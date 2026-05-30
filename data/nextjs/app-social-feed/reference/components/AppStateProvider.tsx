'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_USERS: User[] = [
  { id: 'u1', name: 'You', handle: '@you' },
  { id: 'u2', name: 'Ada', handle: '@ada' },
  { id: 'u3', name: 'Linus', handle: '@linus' },
]

const SEED_POSTS: Post[] = [
  { id: 'p1', authorId: 'u2', text: 'Hello world', likes: 3, likedByMe: false },
  { id: 'p2', authorId: 'u3', text: 'Shipped a feature', likes: 1, likedByMe: true },
  { id: 'p3', authorId: 'u1', text: 'Coffee then code', likes: 0, likedByMe: false },
]

const SEED_COMMENTS: Comment[] = [
  { id: 'c1', postId: 'p1', authorId: 'u3', text: 'Nice!' },
  { id: 'c2', postId: 'p1', authorId: 'u1', text: 'Welcome' },
  { id: 'c3', postId: 'p2', authorId: 'u2', text: 'Congrats' },
]

const CURRENT_USER_ID = 'u1'

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(SEED_USERS)
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS)
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('feed')
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all')
  const [following, setFollowing] = useState<string[]>(['u2'])
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [nextCommentId, setNextCommentId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const toggleLike = (postId: string) => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
            : p,
        ),
      )
    }

    const addComment = (postId: string, text: string) => {
      const trimmed = text.trim()
      if (trimmed.length === 0) return
      const id = `c${nextCommentId}`
      setNextCommentId((n) => n + 1)
      setComments((prev) => [...prev, { id, postId, authorId: CURRENT_USER_ID, text: trimmed }])
    }

    const toggleFollow = (userId: string) => {
      if (userId === CURRENT_USER_ID) return
      setFollowing((prev) =>
        prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
      )
    }

    const openPost = (postId: string) => {
      setSelectedPostId(postId)
      setRoute('post')
    }

    const openProfile = (userId: string) => {
      setSelectedUserId(userId)
      setRoute('profile')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      users,
      posts,
      comments,
      theme,
      route,
      feedFilter,
      currentUserId: CURRENT_USER_ID,
      selectedPostId,
      selectedUserId,
      following,
      toggleLike,
      addComment,
      toggleFollow,
      setFeedFilter,
      setTheme,
      openPost,
      openProfile,
      navigate,
    }
  }, [
    users,
    posts,
    comments,
    theme,
    route,
    feedFilter,
    following,
    selectedPostId,
    selectedUserId,
    nextCommentId,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
