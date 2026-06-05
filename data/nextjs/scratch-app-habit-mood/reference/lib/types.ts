export type MoodEntry = {
  id: string
  date: string
  score: number
  triggers: string[]
}

export type Route = 'today' | 'history' | 'add' | 'insights'
export type Theme = 'light' | 'dark'

export const TODAY = '2026-05-28'
