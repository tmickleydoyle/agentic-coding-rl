'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Engineering' },
  { id: 'c2', name: 'Design' },
  { id: 'c3', name: 'Company' },
]

const SEED_POSTS: Post[] = [
  { id: 'b1', title: 'Hello World', body: 'First post', categoryId: 'c1', status: 'published' },
  { id: 'b2', title: 'Design Systems', body: 'On tokens', categoryId: 'c2', status: 'draft' },
  { id: 'b3', title: 'We are hiring', body: 'Join us', categoryId: 'c3', status: 'published' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS)
  const [categories] = useState<Category[]>(SEED_CATEGORIES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('posts')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addPost = (input: NewPostInput) => {
      const id = `b${nextId}`
      setNextId((n) => n + 1)
      setPosts((prev) => [
        ...prev,
        {
          id,
          title: input.title,
          body: input.body ?? '',
          categoryId: input.categoryId,
          status: input.status ?? 'draft',
        },
      ])
    }

    const togglePublish = (id: string) => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: p.status === 'published' ? 'draft' : 'published' }
            : p,
        ),
      )
    }

    const removePost = (id: string) => {
      setPosts((prev) => prev.filter((p) => p.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      posts,
      categories,
      theme,
      route,
      statusFilter,
      categoryFilter,
      addPost,
      togglePublish,
      removePost,
      setStatusFilter,
      setCategoryFilter,
      setTheme,
      navigate,
    }
  }, [posts, categories, theme, route, statusFilter, categoryFilter, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
