'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Article, CategoryFilter, Route, Theme } from '../lib/types'

type AppApi = {
  articles: Article[]
  theme: Theme
  route: Route
  selectedArticleId: string | null
  categoryFilter: CategoryFilter
  query: string
  voteHelpful: (id: string) => void
  voteNotHelpful: (id: string) => void
  selectArticle: (id: string) => void
  setCategoryFilter: (filter: CategoryFilter) => void
  setQuery: (query: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  articles: [],
  theme: 'light',
  route: 'articles',
  selectedArticleId: null,
  categoryFilter: 'all',
  query: '',
  voteHelpful: () => {},
  voteNotHelpful: () => {},
  selectArticle: () => {},
  setCategoryFilter: () => {},
  setQuery: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold articles/theme/route/selection/categoryFilter/query in state (seed 5 articles),
  // implement voteHelpful/voteNotHelpful/selectArticle/navigate/setCategoryFilter/setQuery/
  // setTheme, and provide them through AppContext. The STUB below makes the app mount but
  // does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
