'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Idea, Route, Status, Task } from '../lib/types'

const ORDER: Status[] = ['todo', 'doing', 'done']

type Ctx = {
  board: Task[]
  backlog: Idea[]
  theme: 'light' | 'dark'
  showCompleted: boolean
  route: Route
  navigate: (r: Route) => void
  addTask: (title: string) => void
  moveTask: (id: number, delta: number) => void
  addIdea: (title: string) => void
  promote: (id: number) => void
  toggleTheme: () => void
  toggleShowCompleted: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [board, setBoard] = useState<Task[]>([])
  const [backlog, setBacklog] = useState<Idea[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showCompleted, setShowCompleted] = useState(true)
  const [route, setRoute] = useState<Route>('board')
  const [nextId, setNextId] = useState(1)

  function addTask(title: string) {
    const t = title.trim()
    if (!t) return
    setBoard((b) => [...b, { id: nextId, title: t, status: 'todo' }])
    setNextId((n) => n + 1)
  }
  function moveTask(id: number, delta: number) {
    setBoard((b) =>
      b.map((t) => {
        if (t.id !== id) return t
        const idx = Math.max(0, Math.min(ORDER.length - 1, ORDER.indexOf(t.status) + delta))
        return { ...t, status: ORDER[idx] }
      }),
    )
  }
  function addIdea(title: string) {
    const t = title.trim()
    if (!t) return
    setBacklog((s) => [...s, { id: nextId, title: t }])
    setNextId((n) => n + 1)
  }
  function promote(id: number) {
    const item = backlog.find((x) => x.id === id)
    if (!item) return
    setBacklog((s) => s.filter((x) => x.id !== id))
    setBoard((b) => [...b, { id: item.id, title: item.title, status: 'todo' }])
  }

  const value: Ctx = {
    board,
    backlog,
    theme,
    showCompleted,
    route,
    navigate: setRoute,
    addTask,
    moveTask,
    addIdea,
    promote,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleShowCompleted: () => setShowCompleted((s) => !s),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
