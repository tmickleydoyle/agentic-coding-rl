'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Card, Column, Route, Theme } from '../lib/types'
import { COLUMNS } from '../lib/types'

type BoardApi = {
  cards: Card[]
  theme: Theme
  route: Route
  wipLimit: number
  addCard: (title: string) => void
  moveForward: (id: string) => void
  moveBack: (id: string) => void
  deleteCard: (id: string) => void
  archiveCard: (id: string) => void
  restoreCard: (id: string) => void
  setWipLimit: (n: number) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const BoardContext = createContext<BoardApi | null>(null)

const SEED_CARDS: Card[] = [
  { id: 'c1', title: 'Set up repo', column: 'backlog', archived: false },
  { id: 'c2', title: 'Write tests', column: 'doing', archived: false },
  { id: 'c3', title: 'Draft API', column: 'doing', archived: false },
  { id: 'c4', title: 'Ship v1', column: 'done', archived: false },
]

function shift(column: Column, delta: number): Column {
  const idx = COLUMNS.indexOf(column)
  const next = idx + delta
  if (next < 0 || next >= COLUMNS.length) return column
  return COLUMNS[next]
}

export function BoardProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<Card[]>(SEED_CARDS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('board')
  const [wipLimit, setWipLimit] = useState(3)
  const [nextId, setNextId] = useState(5)

  const value = useMemo<BoardApi>(() => {
    const addCard = (title: string) => {
      const trimmed = title.trim()
      if (trimmed.length === 0) return
      const id = `c${nextId}`
      setNextId((n) => n + 1)
      setCards((prev) => [
        ...prev,
        { id, title: trimmed, column: 'backlog', archived: false },
      ])
    }

    const moveForward = (id: string) => {
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, column: shift(c.column, 1) } : c)),
      )
    }

    const moveBack = (id: string) => {
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, column: shift(c.column, -1) } : c)),
      )
    }

    const deleteCard = (id: string) => {
      setCards((prev) => prev.filter((c) => c.id !== id))
    }

    const archiveCard = (id: string) => {
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, archived: true } : c)))
    }

    const restoreCard = (id: string) => {
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, archived: false } : c)))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      cards,
      theme,
      route,
      wipLimit,
      addCard,
      moveForward,
      moveBack,
      deleteCard,
      archiveCard,
      restoreCard,
      setWipLimit,
      setTheme,
      navigate,
    }
  }, [cards, theme, route, wipLimit, nextId])

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
}

export function useBoard(): BoardApi {
  const v = useContext(BoardContext)
  if (!v) throw new Error('useBoard must be used within a BoardProvider')
  return v
}
