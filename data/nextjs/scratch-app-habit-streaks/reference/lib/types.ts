export interface Habit {
  id: string
  name: string
  color: string
}

export interface Completion {
  id: string
  habitId: string
  date: string
}

export type Route = 'home' | 'habits' | 'streaks' | 'history'
