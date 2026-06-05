export type TaskStatus = 'todo' | 'doing' | 'done'

export type Member = {
  id: string
  name: string
}

export type Project = {
  id: string
  name: string
}

export type Task = {
  id: string
  title: string
  projectId: string
  assigneeId: string | null
  status: TaskStatus
}

export type Route = 'projects' | 'project-detail' | 'members' | 'board'
export type Theme = 'light' | 'dark'
