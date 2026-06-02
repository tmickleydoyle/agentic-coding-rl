'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Category, Project, Route } from '../lib/types'

type Ctx = {
  projects: Project[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addProject: (title: string, category: Category) => void
  toggleStatus: (id: number) => void
  resetProjects: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Project[] = [
  { id: 1, title: 'Agency Website', category: 'Web', status: 'live' },
  { id: 2, title: 'Food Delivery App', category: 'Mobile', status: 'draft' },
  { id: 3, title: 'Brand Identity', category: 'Design', status: 'live' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('projects')
  const [nextId, setNextId] = useState(4)

  function addProject(title: string, category: Category) {
    const t = title.trim()
    if (!t) return
    setProjects((p) => [...p, { id: nextId, title: t, category, status: 'draft' }])
    setNextId((n) => n + 1)
  }

  function toggleStatus(id: number) {
    setProjects((p) =>
      p.map((proj) =>
        proj.id === id
          ? { ...proj, status: proj.status === 'live' ? 'draft' : 'live' }
          : proj,
      ),
    )
  }

  function resetProjects() {
    setProjects([])
    setNextId(1)
  }

  const value: Ctx = {
    projects,
    theme,
    route,
    navigate: setRoute,
    addProject,
    toggleStatus,
    resetProjects,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
