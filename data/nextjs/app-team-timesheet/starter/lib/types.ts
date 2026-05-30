export type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri'

export type Project = {
  id: string
  name: string
}

export type Entry = {
  id: string
  projectId: string
  day: Day
  hours: number
  submitted: boolean
}

export type Route = 'week' | 'log-entry' | 'projects' | 'approvals'
export type Theme = 'light' | 'dark'

export const DAYS: Day[] = ['mon', 'tue', 'wed', 'thu', 'fri']
