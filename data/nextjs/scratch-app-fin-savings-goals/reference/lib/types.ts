export type Goal = {
  id: string
  name: string
  target: number
  saved: number
  monthlyContribution: number
}

export type Contribution = {
  id: string
  goalId: string
  amount: number
}

export type Route = 'goals' | 'goal-detail' | 'add-goal' | 'settings'
export type Theme = 'light' | 'dark'

// Fixed reference year/month so projected-completion math is deterministic in tests.
export const TODAY = '2026-05'
