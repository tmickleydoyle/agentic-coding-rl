export type Product = {
  id: string
  name: string
  category: string
  price: number
}

export type CartLine = {
  productId: string
  qty: number
}

export type CategoryFilter = 'all' | string

export type Route = 'catalog' | 'product' | 'cart' | 'checkout'
export type Theme = 'light' | 'dark'
