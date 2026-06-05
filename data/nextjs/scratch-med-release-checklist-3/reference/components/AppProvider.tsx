'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Task } from '../lib/types'

type Ctx = {
  tasks: Task[]
  route: Route
  theme: 'light' | 'dark'
  hideCompleted: boolean
  navigate: (r: Route) => void
  addTask: (name: string, owner: string) => void
  toggleDone: (id: number) => void
  deleteTask: (id: number) => void
  toggleHideCompleted: () => void
  toggleTheme: () => void
  clearAll: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Task[] = [
  { id: 1, name: 'Write release notes', owner: 'Alice', done: false },
  { id: 2, name: 'Run smoke tests', owner: 'Bob', done: false },
  { id: 3, name: 'Update changelog', owner: 'Alice', done: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(SEED)
  const [route, setRoute] = useState<Route>('checklist')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideCompleted, setHideCompleted] = useState(false)
  const [nextId, setNextId] = useState(4)

  function addTask(name: string, owner: string) {
    const n = name.trim()
    if (!n) return
    setTasks((prev) => [...prev, { id: nextId, name: n, owner: owner.trim(), done: false }])
    setNextId((x) => x + 1)
  }

  function toggleDone(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function clearAll() {
    setTasks([])
  }

  const value: Ctx = {
    tasks,
    route,
    theme,
    hideCompleted,
    navigate: setRoute,
    addTask,
    toggleDone,
    deleteTask,
    toggleHideCompleted: () => setHideCompleted((s) => !s),
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    clearAll,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
