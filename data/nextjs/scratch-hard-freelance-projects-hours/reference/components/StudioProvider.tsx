'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Project, Entry } from '../lib/types'
import { SEED_PROJECTS } from '../lib/types'

type Ctx = {
  entries: Entry[]
  projects: Project[]
  route: Route
  navigate: (r: Route) => void
  addEntry: (task: string, project: string, hours: string, billable: boolean) => void
  addProject: (name: string, rate: string) => void
}

export const StudioContext = createContext<Ctx | null>(null)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS.map((p) => ({ ...p })))
  const [route, setRoute] = useState<Route>('time')
  const [nextId, setNextId] = useState(1)

  function addEntry(task: string, project: string, hours: string, billable: boolean) {
    const h = parseFloat(hours)
    const trimmed = task.trim()
    if (!trimmed || !isFinite(h) || h <= 0) return
    setEntries((xs) => [...xs, { id: nextId, task: trimmed, project, hours: h, billable }])
    setNextId((n) => n + 1)
  }

  function addProject(name: string, rate: string) {
    const r = parseFloat(rate)
    const trimmed = name.trim()
    if (!trimmed || !isFinite(r) || r <= 0) return
    setProjects((ps) => [...ps, { name: trimmed, rate: r }])
  }

  const value: Ctx = {
    entries,
    projects,
    route,
    navigate: setRoute,
    addEntry,
    addProject,
  }
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}
