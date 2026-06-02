'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Priority, Route, Task } from '../lib/types'

type Ctx = {
  tasks: Task[]
  filter: Priority | 'All'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addTask: (title: string, priority: Priority) => void
  toggleDone: (id: number) => void
  deleteTask: (id: number) => void
  setFilter: (f: Priority | 'All') => void
  toggleTheme: () => void
  clearAll: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Task[] = [
  { id: 1, title: 'Launch landing page', priority: 'High', done: false },
  { id: 2, title: 'Set up analytics', priority: 'Medium', done: false },
  { id: 3, title: 'Write onboarding email', priority: 'Low', done: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(SEED)
  const [filter, setFilterState] = useState<Priority | 'All'>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('tasks')
  const [nextId, setNextId] = useState(4)

  function addTask(title: string, priority: Priority) {
    const t = title.trim()
    if (!t) return
    setTasks((ts) => [...ts, { id: nextId, title: t, priority, done: false }])
    setNextId((n) => n + 1)
  }

  function toggleDone(id: number) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function deleteTask(id: number) {
    setTasks((ts) => ts.filter((t) => t.id !== id))
  }

  const value: Ctx = {
    tasks,
    filter,
    theme,
    route,
    navigate: setRoute,
    addTask,
    toggleDone,
    deleteTask,
    setFilter: setFilterState,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    clearAll: () => setTasks([]),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
