export type Milestone = {
  id: string
  title: string
  done: boolean
}

export type Goal = {
  id: string
  name: string
  targetDate: string
  milestones: Milestone[]
}

export type Route = 'goals' | 'goal-detail' | 'add' | 'completed'
export type Theme = 'light' | 'dark'

export const TODAY = '2026-05-28'
