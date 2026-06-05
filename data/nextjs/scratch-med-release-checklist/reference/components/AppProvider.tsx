'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Task, Route } from '../lib/types'

const SEED: Task[] = [
  { id: 1, title: 'Write release notes', owner: 'Alice', done: false },
  { id: 2, title: 'Run smoke tests', owner: 'Bob', done: false },
  { id: 3, title: 'Update changelog', owner: 'Alice', done: false },
]

type Ctx = {
  tasks: Task[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addTask: (title: string, owner: string) => void
  toggleTask: (id: number) => void
  resetTasks: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('checklist')
  const [nextId, setNextId] = useState(SEED.length + 1)

  function addTask(title: string, owner: string) {
    const t = title.trim()
    if (!t) return
    setTasks((prev) => [...prev, { id: nextId, title: t, owner: owner.trim(), done: false }])
    setNextId((n) => n + 1)
  }

  function toggleTask(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function resetTasks() {
    setTasks([])
  }

  const value: Ctx = {
    tasks,
    theme,
    route,
    navigate: setRoute,
    addTask,
    toggleTask,
    resetTasks,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
