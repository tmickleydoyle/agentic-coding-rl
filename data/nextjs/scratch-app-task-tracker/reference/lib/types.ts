export type Status = 'active' | 'done'

export type Task = {
  id: string
  title: string
  projectId: string
  done: boolean
  dueDate: string | null
}

export type Project = {
  id: string
  name: string
}

export type StatusFilter = 'all' | 'active' | 'done'
export type ProjectFilter = 'all' | string

export type Route = 'dashboard' | 'tasks' | 'new' | 'settings'
export type Theme = 'light' | 'dark'
