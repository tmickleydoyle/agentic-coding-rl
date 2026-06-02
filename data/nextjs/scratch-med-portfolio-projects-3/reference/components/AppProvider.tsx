'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Category, Project, Route } from '../lib/types'

type Ctx = {
  projects: Project[]
  filter: Category | 'All'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addProject: (title: string, category: Category) => void
  toggleStatus: (id: number) => void
  deleteProject: (id: number) => void
  setFilter: (f: Category | 'All') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Project[] = [
  { id: 1, title: 'Personal Website', category: 'Web', status: 'Live' },
  { id: 2, title: 'Fitness App', category: 'Mobile', status: 'Draft' },
  { id: 3, title: 'Logo Pack', category: 'Design', status: 'Live' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(SEED)
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('projects')
  const [nextId, setNextId] = useState(4)

  function addProject(title: string, category: Category) {
    const t = title.trim()
    if (!t) return
    setProjects((ps) => [...ps, { id: nextId, title: t, category, status: 'Draft' }])
    setNextId((n) => n + 1)
  }

  function toggleStatus(id: number) {
    setProjects((ps) =>
      ps.map((p) =>
        p.id === id ? { ...p, status: p.status === 'Live' ? 'Draft' : 'Live' } : p,
      ),
    )
  }

  function deleteProject(id: number) {
    setProjects((ps) => ps.filter((p) => p.id !== id))
  }

  const value: Ctx = {
    projects,
    filter,
    theme,
    route,
    navigate: setRoute,
    addProject,
    toggleStatus,
    deleteProject,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
