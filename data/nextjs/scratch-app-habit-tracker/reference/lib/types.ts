export type Habit = {
  id: string
  name: string
  history: string[]
}

export type Route = 'today' | 'habits' | 'add' | 'stats'
export type Theme = 'light' | 'dark'

export const TODAY = '2026-05-28'
