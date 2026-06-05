'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Category, Project, Route, Status } from '../lib/types'

type Ctx = {
  projects: Project[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addProject: (title: string, category: Category, status: Status) => void
  toggleStatus: (id: number) => void
  deleteProject: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('projects')
  const [nextId, setNextId] = useState(1)

  function addProject(title: string, category: Category, status: Status) {
    const t = title.trim()
    if (!t) return
    setProjects((p) => [...p, { id: nextId, title: t, category, status }])
    setNextId((n) => n + 1)
  }

  function toggleStatus(id: number) {
    setProjects((p) =>
      p.map((proj) =>
        proj.id === id
          ? { ...proj, status: proj.status === 'Live' ? 'Draft' : 'Live' }
          : proj,
      ),
    )
  }

  function deleteProject(id: number) {
    setProjects((p) => p.filter((proj) => proj.id !== id))
  }

  const value: Ctx = {
    projects,
    theme,
    route,
    navigate: setRoute,
    addProject,
    toggleStatus,
    deleteProject,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
