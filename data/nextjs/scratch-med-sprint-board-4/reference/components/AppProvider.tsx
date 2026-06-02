'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Status, Task } from '../lib/types'

const ORDER: Status[] = ['todo', 'inprogress', 'done']

type Ctx = {
  tasks: Task[]
  theme: 'light' | 'dark'
  hideDone: boolean
  route: Route
  navigate: (r: Route) => void
  addTask: (title: string, points: number) => void
  moveTask: (id: number, delta: number) => void
  toggleTheme: () => void
  toggleHideDone: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideDone, setHideDone] = useState(false)
  const [route, setRoute] = useState<Route>('board')
  const [nextId, setNextId] = useState(1)

  function addTask(title: string, points: number) {
    const t = title.trim()
    if (!t) return
    const pts = points > 0 ? points : 1
    setTasks((prev) => [...prev, { id: nextId, title: t, points: pts, status: 'todo' }])
    setNextId((n) => n + 1)
  }

  function moveTask(id: number, delta: number) {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task
        const idx = Math.max(0, Math.min(ORDER.length - 1, ORDER.indexOf(task.status) + delta))
        return { ...task, status: ORDER[idx] }
      }),
    )
  }

  const value: Ctx = {
    tasks,
    theme,
    hideDone,
    route,
    navigate: setRoute,
    addTask,
    moveTask,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideDone: () => setHideDone((h) => !h),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
