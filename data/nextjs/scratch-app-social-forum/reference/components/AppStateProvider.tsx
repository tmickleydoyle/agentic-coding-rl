'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type {
  Category,
  CategoryFilter,
  Reply,
  Route,
  Sort,
  Theme,
  Thread,
} from '../lib/types'

type AppApi = {
  categories: Category[]
  threads: Thread[]
  replies: Reply[]
  theme: Theme
  route: Route
  sort: Sort
  categoryFilter: CategoryFilter
  selectedThreadId: string | null
  addThread: (input: { title: string; categoryId: string }) => void
  upvoteThread: (id: string) => void
  addReply: (threadId: string, text: string) => void
  upvoteReply: (id: string) => void
  setSort: (sort: Sort) => void
  setCategoryFilter: (filter: CategoryFilter) => void
  setTheme: (theme: Theme) => void
  openThread: (threadId: string) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_CATEGORIES: Category[] = [
  { id: 'g1', name: 'General' },
  { id: 'g2', name: 'Help' },
  { id: 'g3', name: 'Showoff' },
]

const SEED_THREADS: Thread[] = [
  { id: 't1', title: 'Welcome thread', categoryId: 'g1', votes: 5, createdAt: 1 },
  { id: 't2', title: 'How do I deploy?', categoryId: 'g2', votes: 2, createdAt: 2 },
  { id: 't3', title: 'Look what I built', categoryId: 'g3', votes: 8, createdAt: 3 },
]

const SEED_REPLIES: Reply[] = [
  { id: 'r1', threadId: 't1', text: 'Hi there!', votes: 1 },
  { id: 'r2', threadId: 't2', text: 'Try the CLI', votes: 3 },
  { id: 'r3', threadId: 't1', text: 'Me too', votes: 0 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [categories] = useState<Category[]>(SEED_CATEGORIES)
  const [threads, setThreads] = useState<Thread[]>(SEED_THREADS)
  const [replies, setReplies] = useState<Reply[]>(SEED_REPLIES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('threads')
  const [sort, setSort] = useState<Sort>('votes')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [nextThreadId, setNextThreadId] = useState(4)
  const [nextReplyId, setNextReplyId] = useState(4)
  const [nextCreatedAt, setNextCreatedAt] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addThread = (input: { title: string; categoryId: string }) => {
      const trimmed = input.title.trim()
      if (trimmed.length === 0) return
      const id = `t${nextThreadId}`
      const createdAt = nextCreatedAt
      setNextThreadId((n) => n + 1)
      setNextCreatedAt((n) => n + 1)
      setThreads((prev) => [
        ...prev,
        { id, title: trimmed, categoryId: input.categoryId, votes: 0, createdAt },
      ])
    }

    const upvoteThread = (id: string) => {
      setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, votes: t.votes + 1 } : t)))
    }

    const addReply = (threadId: string, text: string) => {
      const trimmed = text.trim()
      if (trimmed.length === 0) return
      const id = `r${nextReplyId}`
      setNextReplyId((n) => n + 1)
      setReplies((prev) => [...prev, { id, threadId, text: trimmed, votes: 0 }])
    }

    const upvoteReply = (id: string) => {
      setReplies((prev) => prev.map((r) => (r.id === id ? { ...r, votes: r.votes + 1 } : r)))
    }

    const openThread = (threadId: string) => {
      setSelectedThreadId(threadId)
      setRoute('thread')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      categories,
      threads,
      replies,
      theme,
      route,
      sort,
      categoryFilter,
      selectedThreadId,
      addThread,
      upvoteThread,
      addReply,
      upvoteReply,
      setSort,
      setCategoryFilter,
      setTheme,
      openThread,
      navigate,
    }
  }, [
    categories,
    threads,
    replies,
    theme,
    route,
    sort,
    categoryFilter,
    selectedThreadId,
    nextThreadId,
    nextReplyId,
    nextCreatedAt,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
