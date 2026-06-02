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
  publish: (id: number) => void
  unpublish: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Project[] = [
  { id: 1, title: 'Agency Site', category: 'web', status: 'live' },
  { id: 2, title: 'Mobile App', category: 'mobile', status: 'draft' },
  { id: 3, title: 'Landing Page', category: 'web', status: 'draft' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('projects')
  const [nextId, setNextId] = useState(4)

  function addProject(title: string, category: string) {
    const t = title.trim()
    if (!t) return
    setProjects((p) => [...p, { id: nextId, title: t, category: category.trim(), status: 'draft' }])
    setNextId((n) => n + 1)
  }

  function publish(id: number) {
    setProjects((p) => p.map((proj) => proj.id === id ? { ...proj, status: 'live' } : proj))
  }

  function unpublish(id: number) {
    setProjects((p) => p.map((proj) => proj.id === id ? { ...proj, status: 'draft' } : proj))
  }

  const value: Ctx = {
    projects,
    theme,
    route,
    navigate: setRoute,
    addProject,
    publish,
    unpublish,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
