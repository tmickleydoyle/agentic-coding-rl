'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type {
  Category,
  CategoryFilter,
  Post,
  PostStatus,
  Route,
  StatusFilter,
  Theme,
} from '../lib/types'

type NewPostInput = {
  title: string
  body?: string
  categoryId: string
  status?: PostStatus
}

type AppApi = {
  posts: Post[]
  categories: Category[]
  theme: Theme
  route: Route
  statusFilter: StatusFilter
  categoryFilter: CategoryFilter
  addPost: (input: NewPostInput) => void
  togglePublish: (id: string) => void
  removePost: (id: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setCategoryFilter: (filter: CategoryFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  posts: [],
  categories: [],
  theme: 'light',
  route: 'posts',
  statusFilter: 'all',
  categoryFilter: 'all',
  addPost: () => {},
  togglePublish: () => {},
  removePost: () => {},
  setStatusFilter: () => {},
  setCategoryFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold posts/categories/theme/route/filters in state (seed 3 categories + 3 posts),
  // implement addPost/togglePublish/removePost + setters + navigate, and provide them
  // through AppContext. The STUB makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
