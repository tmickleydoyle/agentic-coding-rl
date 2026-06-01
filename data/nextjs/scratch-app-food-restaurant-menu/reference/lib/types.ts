export type Dish = {
  id: string
  name: string
  category: string
  price: number
  vegetarian: boolean
}

export type CartLine = {
  dishId: string
  qty: number
}

export type CategoryFilter = 'all' | string

export type Route = 'menu' | 'item-detail' | 'cart' | 'checkout'
export type Theme = 'light' | 'dark'

export const TAX_RATE = 0.1
