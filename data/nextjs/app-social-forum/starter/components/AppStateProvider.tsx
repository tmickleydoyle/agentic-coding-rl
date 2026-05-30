'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  categories: [],
  threads: [],
  replies: [],
  theme: 'light',
  route: 'threads',
  sort: 'votes',
  categoryFilter: 'all',
  selectedThreadId: null,
  addThread: () => {},
  upvoteThread: () => {},
  addReply: () => {},
  upvoteReply: () => {},
  setSort: () => {},
  setCategoryFilter: () => {},
  setTheme: () => {},
  openThread: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold categories/threads/replies/theme/route/sort/categoryFilter/selection in
  // state (seed 3 categories + 3 threads + 3 replies), implement the actions, and provide
  // them through AppContext. The STUB below makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
