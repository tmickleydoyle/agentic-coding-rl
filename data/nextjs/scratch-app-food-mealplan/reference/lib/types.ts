export type Recipe = {
  id: string
  title: string
  ingredients: string[]
}

export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

export type Assignment = {
  id: string
  day: Day
  recipeId: string
}

export type GroceryItem = {
  name: string
  count: number
}

export type Route = 'week' | 'day-detail' | 'recipes' | 'grocery'
export type Theme = 'light' | 'dark'

export const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
