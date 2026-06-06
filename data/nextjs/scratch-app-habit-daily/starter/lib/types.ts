export interface Habit {
  id: string
  name: string
  frequency: 'daily' | 'weekly'
  category: string
}

export interface HabitLog {
  id: string
  habitId: string
  date: string
  completed: boolean
}

export type Route = 'home' | 'habits' | 'log' | 'stats'
