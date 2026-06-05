export type Category = 'electronics' | 'furniture' | 'vehicles' | 'misc'

export type Listing = {
  id: string
  title: string
  category: Category
  price: number
  seller: string
  description: string
}

export type CategoryFilter = 'all' | Category

export type Route = 'browse' | 'detail' | 'post' | 'favorites'
export type Theme = 'light' | 'dark'

export const CATEGORIES: Category[] = ['electronics', 'furniture', 'vehicles', 'misc']
