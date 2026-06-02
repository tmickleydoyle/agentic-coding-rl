'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Task, Route } from '../lib/types'

type Ctx = {
  tasks: Task[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addTask: (name: string, owner: string) => void
  toggleDone: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Task[] = [
  { id: 1, name: 'Write release notes', owner: 'Alice', done: false },
  { id: 2, name: 'Deploy to staging', owner: 'Bob', done: false },
  { id: 3, name: 'Notify stakeholders', owner: 'Alice', done: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(SEED)
  const [route, setRoute] = useState<Route>('checklist')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(4)

  function addTask(name: string, owner: string) {
    const n = name.trim()
    const o = owner.trim()
    if (!n || !o) return
    setTasks((t) => [...t, { id: nextId, name: n, owner: o, done: false }])
    setNextId((i) => i + 1)
  }

  function toggleDone(id: number) {
    setTasks((t) => t.map((task) => task.id === id ? { ...task, done: !task.done } : task))
  }

  const value: Ctx = {
    tasks,
    route,
    theme,
    navigate: setRoute,
    addTask,
    toggleDone,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
