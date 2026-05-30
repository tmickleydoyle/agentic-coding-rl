'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Note, Notebook, Route, Theme } from '../lib/types'

type NewNoteInput = {
  notebookId: string
  title: string
  body?: string
  tags?: string[]
}

type NotePatch = {
  title?: string
  body?: string
  tags?: string[]
}

type AppApi = {
  notebooks: Notebook[]
  notes: Note[]
  theme: Theme
  route: Route
  selectedNotebookId: string | null
  editingNoteId: string | null
  tagFilter: string | null
  searchQuery: string
  addNote: (input: NewNoteInput) => Note
  updateNote: (id: string, patch: NotePatch) => void
  removeNote: (id: string) => void
  togglePin: (id: string) => void
  selectNotebook: (id: string) => void
  startNewNote: (notebookId: string) => void
  startEditNote: (id: string) => void
  setTagFilter: (tag: string | null) => void
  setSearchQuery: (q: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  notebooks: [],
  notes: [],
  theme: 'light',
  route: 'notebooks',
  selectedNotebookId: null,
  editingNoteId: null,
  tagFilter: null,
  searchQuery: '',
  addNote: () => ({ id: '', notebookId: '', title: '', body: '', tags: [], pinned: false }),
  updateNote: () => {},
  removeNote: () => {},
  togglePin: () => {},
  selectNotebook: () => {},
  startNewNote: () => {},
  startEditNote: () => {},
  setTagFilter: () => {},
  setSearchQuery: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold notebooks/notes/theme/route/selection/filters in state (seed 2 notebooks +
  // 3 notes), implement the actions, and provide them through AppContext. The STUB below
  // makes the app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
