export type Hire = {
  id: string
  name: string
  role: string
  startDate: string
}

export type OnboardTask = {
  id: string
  hireId: string
  label: string
  done: boolean
}

export type Route = 'hires' | 'hire-detail' | 'tasks' | 'progress'
export type Theme = 'light' | 'dark'
