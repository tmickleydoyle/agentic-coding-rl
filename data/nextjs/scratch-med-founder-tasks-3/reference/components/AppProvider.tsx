'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Priority, Route, Task } from '../lib/types'

type Ctx = {
  tasks: Task[]
  theme: 'light' | 'dark'
  route: Route
  filter: Priority | 'All'
  navigate: (r: Route) => void
  addTask: (title: string, priority: Priority) => void
  toggleDone: (id: number) => void
  deleteTask: (id: number) => void
  setFilter: (f: Priority | 'All') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('tasks')
  const [filter, setFilter] = useState<Priority | 'All'>('All')
  const [nextId, setNextId] = useState(1)

  function addTask(title: string, priority: Priority) {
    const t = title.trim()
    if (!t) return
    setTasks((prev) => [...prev, { id: nextId, title: t, priority, done: false }])
    setNextId((n) => n + 1)
  }

  function toggleDone(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const value: Ctx = {
    tasks,
    theme,
    route,
    filter,
    navigate: setRoute,
    addTask,
    toggleDone,
    deleteTask,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
