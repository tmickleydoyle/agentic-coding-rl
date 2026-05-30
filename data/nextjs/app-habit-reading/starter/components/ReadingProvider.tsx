'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: ReadingApi = {
  logs: [],
  books: [],
  theme: 'light',
  route: 'today',
  today: TODAY,
  logPages: () => {},
  removeLog: () => {},
  toggleBook: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function ReadingProvider({ children }: { children: ReactNode }) {
  // TODO: hold logs/books/theme/route/today in state (seed 3 logs + 3 books), implement
  // logPages (upsert by date, ids l4, …), removeLog, toggleBook, and navigate. The STUB
  // makes the app mount but does nothing.
  return <ReadingContext.Provider value={STUB}>{children}</ReadingContext.Provider>
}

export function useReading(): ReadingApi {
  const v = useContext(ReadingContext)
  if (!v) throw new Error('useReading must be used within a ReadingProvider')
  return v
}
