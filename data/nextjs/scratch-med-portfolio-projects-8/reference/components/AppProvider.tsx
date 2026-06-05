'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Project, Category, Status, Route } from '../lib/types'

const SEED: Project[] = [
  { id: 1, title: 'Portfolio site', category: 'Web', status: 'Live' },
  { id: 2, title: 'iOS app', category: 'Mobile', status: 'Draft' },
  { id: 3, title: 'Brand identity', category: 'Design', status: 'Live' },
]

type Ctx = {
  projects: Project[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addProject: (title: string, category: Category, status: Status) => void
  deleteProject: (id: number) => void
  toggleStatus: (id: number) => void
  resetProjects: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('projects')
  const [nextId, setNextId] = useState(4)

  function addProject(title: string, category: Category, status: Status) {
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

  function resetProjects() {
    setProjects([])
  }

  const value: Ctx = {
    projects,
    theme,
    route,
    navigate: setRoute,
    addProject,
    deleteProject,
    toggleStatus,
    resetProjects,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
