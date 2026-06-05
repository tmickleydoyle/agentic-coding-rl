'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Priority, Route, Task } from '../lib/types'

type Ctx = {
  tasks: Task[]
  filter: Priority | 'all'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addTask: (name: string, priority: Priority) => void
  toggleDone: (id: number) => void
  setFilter: (f: Priority | 'all') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<Priority | 'all'>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('tasks')
  const [nextId, setNextId] = useState(1)

  function addTask(name: string, priority: Priority) {
    const n = name.trim()
    if (!n) return
    setTasks((t) => [...t, { id: nextId, name: n, priority, done: false }])
    setNextId((i) => i + 1)
  }

  function toggleDone(id: number) {
    setTasks((t) => t.map((task) => task.id === id ? { ...task, done: !task.done } : task))
  }

  const value: Ctx = {
    tasks,
    filter,
    theme,
    route,
    navigate: setRoute,
    addTask,
    toggleDone,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
