'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Priority, Route, Task } from '../lib/types'

type Ctx = {
  tasks: Task[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addTask: (name: string, priority: Priority) => void
  toggleDone: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('tasks')
  const [nextId, setNextId] = useState(1)

  function addTask(name: string, priority: Priority) {
    const n = name.trim()
    if (!n) return
    setTasks((ts) => [...ts, { id: nextId, name: n, priority, done: false }])
    setNextId((id) => id + 1)
  }

  function toggleDone(id: number) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const value: Ctx = {
    tasks,
    theme,
    route,
    navigate: setRoute,
    addTask,
    toggleDone,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
