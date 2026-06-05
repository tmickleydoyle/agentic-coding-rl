'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Task } from '../lib/types'

type Ctx = {
  tasks: Task[]
  theme: 'light' | 'dark'
  hideCompleted: boolean
  route: Route
  navigate: (r: Route) => void
  addTask: (name: string, owner: string) => void
  toggleDone: (id: number) => void
  toggleTheme: () => void
  toggleHideCompleted: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Task[] = [
  { id: 1, name: 'Write release notes', owner: 'Alice', done: false },
  { id: 2, name: 'Deploy to staging', owner: 'Bob', done: false },
  { id: 3, name: 'Smoke test', owner: 'Alice', done: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideCompleted, setHideCompleted] = useState(false)
  const [route, setRoute] = useState<Route>('checklist')
  const [nextId, setNextId] = useState(4)

  function addTask(name: string, owner: string) {
    const n = name.trim()
    if (!n) return
    const o = owner.trim() || 'Unassigned'
    setTasks((ts) => [...ts, { id: nextId, name: n, owner: o, done: false }])
    setNextId((id) => id + 1)
  }

  function toggleDone(id: number) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const value: Ctx = {
    tasks,
    theme,
    hideCompleted,
    route,
    navigate: setRoute,
    addTask,
    toggleDone,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideCompleted: () => setHideCompleted((h) => !h),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
