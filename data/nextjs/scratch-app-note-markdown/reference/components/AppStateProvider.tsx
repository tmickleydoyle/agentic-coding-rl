'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_NOTES: Note[] = [
  { id: 'm1', title: 'Welcome', body: '# Hello\n\nThis is **bold**.', tags: ['intro'] },
  { id: 'm2', title: 'Todo', body: '- one\n- two', tags: ['task', 'daily'] },
  { id: 'm3', title: 'Reference', body: 'Use `code` here', tags: ['intro', 'docs'] },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('list')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addNote = (input: NewNoteInput): Note => {
      const id = `m${nextId}`
      setNextId((n) => n + 1)
      const note: Note = {
        id,
        title: input.title,
        body: input.body ?? '',
        tags: input.tags ?? [],
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

    const removeNote = (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id))

    const startNewNote = () => {
      setEditingNoteId(null)
      setRoute('editor')
    }

    const startEditNote = (id: string) => {
      setEditingNoteId(id)
      setRoute('editor')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      notes,
      theme,
      route,
      editingNoteId,
      tagFilter,
      addNote,
      updateNote,
      removeNote,
      startNewNote,
      startEditNote,
      setTagFilter,
      setTheme,
      navigate,
    }
  }, [notes, theme, route, editingNoteId, tagFilter, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
