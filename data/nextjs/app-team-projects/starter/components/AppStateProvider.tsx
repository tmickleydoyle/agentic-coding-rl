'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Member, Project, Route, Task, TaskStatus, Theme } from '../lib/types'

type NewTaskInput = {
  title: string
  projectId: string
  assigneeId?: string | null
}

type AppApi = {
  members: Member[]
  projects: Project[]
  tasks: Task[]
  theme: Theme
  route: Route
  selectedProjectId: string | null
  addTask: (input: NewTaskInput) => void
  reassignTask: (taskId: string, assigneeId: string | null) => void
  setTaskStatus: (taskId: string, status: TaskStatus) => void
  selectProject: (projectId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  members: [],
  projects: [],
  tasks: [],
  theme: 'light',
  route: 'projects',
  selectedProjectId: null,
  addTask: () => {},
  reassignTask: () => {},
  setTaskStatus: () => {},
  selectProject: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold members/projects/tasks/theme/route/selectedProjectId in state (seed 3
  // members + 3 projects + 3 tasks), implement the actions, and provide them through
  // AppContext. The STUB below makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
