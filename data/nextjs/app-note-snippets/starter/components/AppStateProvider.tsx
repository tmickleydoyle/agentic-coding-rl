'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Route, Snippet, Theme } from '../lib/types'

type NewSnippetInput = { title: string; language: string; code?: string }

type AppApi = {
  snippets: Snippet[]
  theme: Theme
  route: Route
  selectedId: string | null
  languageFilter: string | null
  searchQuery: string
  addSnippet: (input: NewSnippetInput) => Snippet
  toggleFavorite: (id: string) => void
  incrementCopy: (id: string) => void
  removeSnippet: (id: string) => void
  openSnippet: (id: string) => void
  setLanguageFilter: (lang: string | null) => void
  setSearchQuery: (q: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  snippets: [],
  theme: 'light',
  route: 'snippets',
  selectedId: null,
  languageFilter: null,
  searchQuery: '',
  addSnippet: () => ({ id: '', title: '', language: '', code: '', favorite: false, copyCount: 0 }),
  toggleFavorite: () => {},
  incrementCopy: () => {},
  removeSnippet: () => {},
  openSnippet: () => {},
  setLanguageFilter: () => {},
  setSearchQuery: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold snippets/theme/route/selection/filters in state (seed 3 snippets),
  // implement the actions, and provide them through AppContext. Replace the STUB.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
