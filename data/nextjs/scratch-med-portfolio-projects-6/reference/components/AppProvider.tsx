'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Project, Route } from '../lib/types'

type Filter = 'all' | 'live'

type Ctx = {
  projects: Project[]
  filter: Filter
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addProject: (title: string, category: string) => void
  toggleStatus: (id: number) => void
  setFilter: (f: Filter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Project[] = [
  { id: 1, title: 'Brand Redesign', category: 'Design', status: 'live' },
  { id: 2, title: 'API Integration', category: 'Development', status: 'draft' },
  { id: 3, title: 'Landing Page', category: 'Design', status: 'live' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(SEED)
  const [filter, setFilter] = useState<Filter>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('projects')
  const [nextId, setNextId] = useState(4)

  function addProject(title: string, category: string) {
    const t = title.trim()
    const c = category.trim()
    if (!t || !c) return
    setProjects((prev) => [...prev, { id: nextId, title: t, category: c, status: 'draft' }])
    setNextId((n) => n + 1)
  }

  function toggleStatus(id: number) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'live' ? 'draft' : 'live' } : p,
      ),
    )
  }

  const value: Ctx = {
    projects,
    filter,
    theme,
    route,
    navigate: setRoute,
    addProject,
    toggleStatus,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
