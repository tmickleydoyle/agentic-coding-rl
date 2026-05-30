'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_ARTICLES: Article[] = [
  { id: 'a1', title: 'Reset your password', body: 'Use the forgot password link to reset.', category: 'account', helpful: 5, notHelpful: 1 },
  { id: 'a2', title: 'Update payment method', body: 'Go to billing settings to update your card.', category: 'billing', helpful: 3, notHelpful: 0 },
  { id: 'a3', title: 'App is slow to load', body: 'Clear your cache and reload the technical page.', category: 'technical', helpful: 2, notHelpful: 2 },
  { id: 'a4', title: 'Contact support', body: 'Reach our general support team by email.', category: 'general', helpful: 8, notHelpful: 1 },
  { id: 'a5', title: 'Cancel your subscription', body: 'Cancel any time from billing settings.', category: 'billing', helpful: 4, notHelpful: 3 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(SEED_ARTICLES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('articles')
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [query, setQuery] = useState('')

  const value = useMemo<AppApi>(() => {
    const voteHelpful = (id: string) => {
      setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, helpful: a.helpful + 1 } : a)))
    }
    const voteNotHelpful = (id: string) => {
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, notHelpful: a.notHelpful + 1 } : a)),
      )
    }
    const selectArticle = (id: string) => {
      setSelectedArticleId(id)
      setRoute('article-detail')
    }
    const navigate = (next: Route) => setRoute(next)

    return {
      articles,
      theme,
      route,
      selectedArticleId,
      categoryFilter,
      query,
      voteHelpful,
      voteNotHelpful,
      selectArticle,
      setCategoryFilter,
      setQuery,
      setTheme,
      navigate,
    }
  }, [articles, theme, route, selectedArticleId, categoryFilter, query])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
