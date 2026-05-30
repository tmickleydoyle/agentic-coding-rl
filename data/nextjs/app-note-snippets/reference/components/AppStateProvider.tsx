'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_SNIPPETS: Snippet[] = [
  { id: 's1', title: 'Debounce', language: 'js', code: 'const debounce = ...', favorite: false, copyCount: 0 },
  { id: 's2', title: 'Quick sort', language: 'python', code: 'def quicksort(a): ...', favorite: true, copyCount: 2 },
  { id: 's3', title: 'Flex center', language: 'css', code: '.c { display: flex; }', favorite: false, copyCount: 0 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [snippets, setSnippets] = useState<Snippet[]>(SEED_SNIPPETS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('snippets')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [languageFilter, setLanguageFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addSnippet = (input: NewSnippetInput): Snippet => {
      const id = `s${nextId}`
      setNextId((n) => n + 1)
      const snippet: Snippet = {
        id,
        title: input.title,
        language: input.language,
        code: input.code ?? '',
        favorite: false,
        copyCount: 0,
      }
      setSnippets((prev) => [...prev, snippet])
      return snippet
    }

    const toggleFavorite = (id: string) => {
      setSnippets((prev) => prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)))
    }

    const incrementCopy = (id: string) => {
      setSnippets((prev) => prev.map((s) => (s.id === id ? { ...s, copyCount: s.copyCount + 1 } : s)))
    }

    const removeSnippet = (id: string) => {
      setSnippets((prev) => prev.filter((s) => s.id !== id))
    }

    const openSnippet = (id: string) => {
      setSelectedId(id)
      setRoute('detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      snippets,
      theme,
      route,
      selectedId,
      languageFilter,
      searchQuery,
      addSnippet,
      toggleFavorite,
      incrementCopy,
      removeSnippet,
      openSnippet,
      setLanguageFilter,
      setSearchQuery,
      setTheme,
      navigate,
    }
  }, [snippets, theme, route, selectedId, languageFilter, searchQuery, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
