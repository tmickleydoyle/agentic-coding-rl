export type Task = {
  id: string
  title: string
  sessions: number
  done: boolean
}

export type Route = 'tasks' | 'focus' | 'stats' | 'settings'
export type Theme = 'light' | 'dark'

export const SESSION_SECONDS = 1500
