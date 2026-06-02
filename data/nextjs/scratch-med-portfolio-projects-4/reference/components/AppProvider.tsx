'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Project, Route } from '../lib/types'

type Ctx = {
  projects: Project[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addProject: (title: string, category: string) => void
  toggleStatus: (id: number) => void
  deleteProject: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Project[] = [
  { id: 1, title: 'Personal Website', category: 'Web', status: 'live' },
  { id: 2, title: 'Budget App', category: 'Mobile', status: 'draft' },
  { id: 3, title: 'API Boilerplate', category: 'Backend', status: 'live' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('projects')
  const [nextId, setNextId] = useState(4)

  function addProject(title: string, category: string) {
    const t = title.trim()
    const c = category.trim()
    if (!t || !c) return
    setProjects((p) => [...p, { id: nextId, title: t, category: c, status: 'draft' }])
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
