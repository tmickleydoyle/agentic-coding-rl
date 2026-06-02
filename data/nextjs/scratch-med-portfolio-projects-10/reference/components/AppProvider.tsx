'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Project, Category, Status, Route } from '../lib/types'

type FilterStatus = 'All' | 'Live' | 'Draft'

type Ctx = {
  projects: Project[]
  filter: FilterStatus
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addProject: (title: string, category: Category, status: Status) => void
  deleteProject: (id: number) => void
  toggleStatus: (id: number) => void
  setFilter: (f: FilterStatus) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Project[] = [
  { id: 1, title: 'Personal Site', category: 'Web', status: 'Live' },
  { id: 2, title: 'Recipe App', category: 'Mobile', status: 'Draft' },
  { id: 3, title: 'Logo Pack', category: 'Design', status: 'Live' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(SEED)
  const [filter, setFilter] = useState<FilterStatus>('All')
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
      p.map((x) => x.id === id ? { ...x, status: x.status === 'Live' ? 'Draft' : 'Live' } : x)
    )
  }

  const value: Ctx = {
    projects,
    filter,
    theme,
    route,
    navigate: setRoute,
    addProject,
    deleteProject,
    toggleStatus,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
