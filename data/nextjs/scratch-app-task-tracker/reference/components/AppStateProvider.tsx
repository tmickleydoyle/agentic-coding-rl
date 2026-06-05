'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_PROJECTS: Project[] = [
  { id: 'p1', name: 'Inbox' },
  { id: 'p2', name: 'Work' },
  { id: 'p3', name: 'Home' },
]

const SEED_TASKS: Task[] = [
  { id: 't1', title: 'Write spec', projectId: 'p2', done: false, dueDate: '2026-06-01' },
  { id: 't2', title: 'Buy groceries', projectId: 'p3', done: true, dueDate: null },
  { id: 't3', title: 'Triage inbox', projectId: 'p1', done: false, dueDate: null },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS)
  const [projects] = useState<Project[]>(SEED_PROJECTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('dashboard')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all')

  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addTask = (input: NewTaskInput) => {
      const id = `t${nextId}`
      setNextId((n) => n + 1)
      setTasks((prev) => [
        ...prev,
        {
          id,
          title: input.title,
          projectId: input.projectId,
          done: false,
          dueDate: input.dueDate ?? null,
        },
      ])
    }

    const toggleTask = (id: string) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
    }

    const removeTask = (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      tasks,
      projects,
      theme,
      route,
      statusFilter,
      projectFilter,
      addTask,
      toggleTask,
      removeTask,
      setStatusFilter,
      setProjectFilter,
      setTheme,
      navigate,
    }
  }, [tasks, projects, theme, route, statusFilter, projectFilter, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
