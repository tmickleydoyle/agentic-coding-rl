'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_NOTEBOOKS: Notebook[] = [
  { id: 'nb1', name: 'Personal' },
  { id: 'nb2', name: 'Work' },
]

const SEED_NOTES: Note[] = [
  { id: 'n1', notebookId: 'nb1', title: 'Grocery list', body: 'Milk and eggs', tags: ['errand'], pinned: false },
  { id: 'n2', notebookId: 'nb2', title: 'Sprint goals', body: 'Ship the editor', tags: ['planning'], pinned: true },
  { id: 'n3', notebookId: 'nb1', title: 'Book ideas', body: 'A novel about notebooks', tags: ['writing', 'fun'], pinned: false },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [notebooks] = useState<Notebook[]>(SEED_NOTEBOOKS)
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('notebooks')
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addNote = (input: NewNoteInput): Note => {
      const id = `n${nextId}`
      setNextId((n) => n + 1)
      const note: Note = {
        id,
        notebookId: input.notebookId,
        title: input.title,
        body: input.body ?? '',
        tags: input.tags ?? [],
        pinned: false,
      }
      setNotes((prev) => [...prev, note])
      return note
    }

    const updateNote = (id: string, patch: NotePatch) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                title: patch.title ?? n.title,
                body: patch.body ?? n.body,
                tags: patch.tags ?? n.tags,
              }
            : n,
        ),
      )
    }

    const removeNote = (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id))
    }

    const togglePin = (id: string) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)))
    }

    const selectNotebook = (id: string) => {
      setSelectedNotebookId(id)
      setTagFilter(null)
      setRoute('notes')
    }

    const startNewNote = (notebookId: string) => {
      setSelectedNotebookId(notebookId)
      setEditingNoteId(null)
      setRoute('editor')
    }

    const startEditNote = (id: string) => {
      setEditingNoteId(id)
      setRoute('editor')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      notebooks,
      notes,
      theme,
      route,
      selectedNotebookId,
      editingNoteId,
      tagFilter,
      searchQuery,
      addNote,
      updateNote,
      removeNote,
      togglePin,
      selectNotebook,
      startNewNote,
      startEditNote,
      setTagFilter,
      setSearchQuery,
      setTheme,
      navigate,
    }
  }, [notebooks, notes, theme, route, selectedNotebookId, editingNoteId, tagFilter, searchQuery, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
