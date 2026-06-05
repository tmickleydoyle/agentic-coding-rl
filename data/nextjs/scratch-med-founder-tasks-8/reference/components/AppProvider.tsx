'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Priority, Route, Task } from '../lib/types'

type Ctx = {
  tasks: Task[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addTask: (name: string, priority: Priority) => void
  toggleDone: (id: number) => void
  deleteTask: (id: number) => void
  clearAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [route, setRoute] = useState<Route>('tasks')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(1)

  function addTask(name: string, priority: Priority) {
    const n = name.trim()
    if (!n) return
    setTasks((t) => [...t, { id: nextId, name: n, priority, done: false }])
    setNextId((i) => i + 1)
  }

  function toggleDone(id: number) {
    setTasks((t) => t.map((x) => x.id === id ? { ...x, done: !x.done } : x))
  }

  function deleteTask(id: number) {
    setTasks((t) => t.filter((x) => x.id !== id))
  }

  function clearAll() {
    setTasks([])
  }

  const value: Ctx = {
    tasks,
    route,
    theme,
    navigate: setRoute,
    addTask,
    toggleDone,
    deleteTask,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
