'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Book, ReadLog, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type ReadingApi = {
  logs: ReadLog[]
  books: Book[]
  theme: Theme
  route: Route
  today: string
  logPages: (input: { date: string; pages: number }) => void
  removeLog: (id: string) => void
  toggleBook: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const ReadingContext = createContext<ReadingApi | null>(null)

const SEED_LOGS: ReadLog[] = [
  { id: 'l1', date: '2026-05-26', pages: 30 },
  { id: 'l2', date: '2026-05-27', pages: 45 },
  { id: 'l3', date: '2026-05-28', pages: 20 },
]

const SEED_BOOKS: Book[] = [
  { id: 'b1', title: 'Dune', done: true },
  { id: 'b2', title: '1984', done: false },
  { id: 'b3', title: 'Hyperion', done: true },
]

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<ReadLog[]>(SEED_LOGS)
  const [books, setBooks] = useState<Book[]>(SEED_BOOKS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('today')
  const [today] = useState(TODAY)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<ReadingApi>(() => {
    const logPages = (input: { date: string; pages: number }) => {
      setLogs((prev) => {
        const existing = prev.find((l) => l.date === input.date)
        if (existing) {
          return prev.map((l) =>
            l.date === input.date ? { ...l, pages: input.pages } : l,
          )
        }
        const id = `l${nextId}`
        setNextId((n) => n + 1)
        return [...prev, { id, date: input.date, pages: input.pages }]
      })
    }

    const removeLog = (id: string) => {
      setLogs((prev) => prev.filter((l) => l.id !== id))
    }

    const toggleBook = (id: string) => {
      setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, done: !b.done } : b)))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      logs,
      books,
      theme,
      route,
      today,
      logPages,
      removeLog,
      toggleBook,
      setTheme,
      navigate,
    }
  }, [logs, books, theme, route, today, nextId])

  return <ReadingContext.Provider value={value}>{children}</ReadingContext.Provider>
}

export function useReading(): ReadingApi {
  const v = useContext(ReadingContext)
  if (!v) throw new Error('useReading must be used within a ReadingProvider')
  return v
}
