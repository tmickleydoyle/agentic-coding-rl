export type EventItem = {
  id: string
  title: string
  day: number
  category: string
}

export type Route = 'month' | 'event-detail' | 'create' | 'categories'
export type Theme = 'light' | 'dark'

export const DAYS_IN_MONTH = 31
export const FIRST_WEEKDAY = 3
export const CATEGORIES: string[] = ['work', 'social', 'personal']
