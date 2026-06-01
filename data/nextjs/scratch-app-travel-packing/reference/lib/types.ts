export type Category = 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'other'

export type Item = {
  id: string
  tripId: string
  name: string
  category: Category
  packed: boolean
}

export type Trip = {
  id: string
  name: string
}

export type Route = 'trips' | 'list' | 'add-item' | 'summary'
export type Theme = 'light' | 'dark'

export const CATEGORIES: Category[] = [
  'clothing',
  'toiletries',
  'electronics',
  'documents',
  'other',
]
