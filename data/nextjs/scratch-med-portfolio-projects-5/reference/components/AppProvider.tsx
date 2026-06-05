'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Category, Project, Route, StatusType } from '../lib/types'

type Ctx = {
  projects: Project[]
  route: Route
  theme: 'light' | 'dark'
  defaultStatus: StatusType
  navigate: (r: Route) => void
  addProject: (title: string, category: Category, status: StatusType) => void
  toggleStatus: (id: number) => void
  deleteProject: (id: number) => void
  toggleTheme: () => void
  setDefaultStatus: (s: StatusType) => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Project[] = [
  { id: 1, title: 'Landing Page', category: 'Web', status: 'Live' },
  { id: 2, title: 'iOS App', category: 'Mobile', status: 'Draft' },
  { id: 3, title: 'Brand Kit', category: 'Design', status: 'Live' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(SEED)
  const [route, setRoute] = useState<Route>('projects')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [defaultStatus, setDefaultStatusState] = useState<StatusType>('Live')
  const [nextId, setNextId] = useState(4)

  function addProject(title: string, category: Category, status: StatusType) {
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
    route,
    theme,
    defaultStatus,
    navigate: setRoute,
    addProject,
    toggleStatus,
    deleteProject,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    setDefaultStatus: setDefaultStatusState,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
