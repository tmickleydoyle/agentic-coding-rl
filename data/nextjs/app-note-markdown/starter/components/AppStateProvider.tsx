'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Note, Route, Theme } from '../lib/types'

type NewNoteInput = { title: string; body?: string; tags?: string[] }
type NotePatch = { title?: string; body?: string; tags?: string[] }

type AppApi = {
  notes: Note[]
  theme: Theme
  route: Route
  editingNoteId: string | null
  tagFilter: string | null
  addNote: (input: NewNoteInput) => Note
  updateNote: (id: string, patch: NotePatch) => void
  removeNote: (id: string) => void
  startNewNote: () => void
  startEditNote: (id: string) => void
  setTagFilter: (tag: string | null) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  notes: [],
  theme: 'light',
  route: 'list',
  editingNoteId: null,
  tagFilter: null,
  addNote: () => ({ id: '', title: '', body: '', tags: [] }),
  updateNote: () => {},
  removeNote: () => {},
  startNewNote: () => {},
  startEditNote: () => {},
  setTagFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold notes/theme/route/editingNoteId/tagFilter in state (seed 3 notes),
  // implement the actions, and provide them through AppContext. Replace the STUB.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
