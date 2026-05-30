'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_MEMBERS: Member[] = [
  { id: 'm1', name: 'Ada' },
  { id: 'm2', name: 'Grace' },
  { id: 'm3', name: 'Linus' },
]

const SEED_PROJECTS: Project[] = [
  { id: 'p1', name: 'Website' },
  { id: 'p2', name: 'Mobile' },
  { id: 'p3', name: 'Platform' },
]

const SEED_TASKS: Task[] = [
  { id: 'k1', title: 'Design home', projectId: 'p1', assigneeId: 'm1', status: 'doing' },
  { id: 'k2', title: 'Ship login', projectId: 'p1', assigneeId: 'm2', status: 'todo' },
  { id: 'k3', title: 'API gateway', projectId: 'p3', assigneeId: 'm1', status: 'done' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [members] = useState<Member[]>(SEED_MEMBERS)
  const [projects] = useState<Project[]>(SEED_PROJECTS)
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('projects')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addTask = (input: NewTaskInput) => {
      const id = `k${nextId}`
      setNextId((n) => n + 1)
      setTasks((prev) => [
        ...prev,
        {
          id,
          title: input.title,
          projectId: input.projectId,
          assigneeId: input.assigneeId ?? null,
          status: 'todo',
        },
      ])
    }

    const reassignTask = (taskId: string, assigneeId: string | null) => {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, assigneeId } : t)))
    }

    const setTaskStatus = (taskId: string, status: TaskStatus) => {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)))
    }

    const selectProject = (projectId: string) => {
      setSelectedProjectId(projectId)
      setRoute('project-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      members,
      projects,
      tasks,
      theme,
      route,
      selectedProjectId,
      addTask,
      reassignTask,
      setTaskStatus,
      selectProject,
      setTheme,
      navigate,
    }
  }, [members, projects, tasks, theme, route, selectedProjectId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
