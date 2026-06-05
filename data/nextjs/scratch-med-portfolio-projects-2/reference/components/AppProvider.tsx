'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Project, Route, Category, ProjectStatus } from '../lib/types'

type Ctx = {
  projects: Project[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addProject: (title: string, category: Category, status: ProjectStatus) => void
  deleteProject: (id: number) => void
  toggleStatus: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [route, setRoute] = useState<Route>('projects')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(1)

  function addProject(title: string, category: Category, status: ProjectStatus) {
    const t = title.trim()
    if (!t) return
    setProjects((p) => [...p, { id: nextId, title: t, category, status }])
    setNextId((n) => n + 1)
  }

  function deleteProject(id: number) {
    setProjects((p) => p.filter((x) => x.id !== id))
  }

  function toggleStatus(id: number) {
    setProjects((p) =>
      p.map((x) =>
        x.id === id ? { ...x, status: x.status === 'Live' ? 'Draft' : 'Live' } : x,
      ),
    )
  }

  const value: Ctx = {
    projects,
    route,
    theme,
    navigate: setRoute,
    addProject,
    deleteProject,
    toggleStatus,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
