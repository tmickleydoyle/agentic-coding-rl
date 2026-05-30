'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type {
  Project,
  ProjectFilter,
  Route,
  StatusFilter,
  Task,
  Theme,
} from '../lib/types'

type NewTaskInput = {
  title: string
  projectId: string
  dueDate?: string | null
}

type AppApi = {
  tasks: Task[]
  projects: Project[]
  theme: Theme
  route: Route
  statusFilter: StatusFilter
  projectFilter: ProjectFilter
  addTask: (input: NewTaskInput) => void
  toggleTask: (id: string) => void
  removeTask: (id: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setProjectFilter: (filter: ProjectFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  tasks: [],
  projects: [],
  theme: 'light',
  route: 'dashboard',
  statusFilter: 'all',
  projectFilter: 'all',
  addTask: () => {},
  toggleTask: () => {},
  removeTask: () => {},
  setStatusFilter: () => {},
  setProjectFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold tasks/projects/theme/route/filters in state (seed 3 projects + 3 tasks),
  // implement the actions, and provide them through AppContext. The STUB below makes the
  // app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
