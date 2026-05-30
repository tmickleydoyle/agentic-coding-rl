export type Meal = {
  id: string
  name: string
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type Goal = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type Route = 'today' | 'history' | 'add-meal' | 'goals'
export type Theme = 'light' | 'dark'
