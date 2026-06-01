export type Product = {
  id: string
  name: string
  price: number
  stock: number
}

export type Order = {
  id: string
  productId: string
  qty: number
  fulfilled: boolean
}

export type Route = 'products' | 'orders' | 'add' | 'revenue'
export type Theme = 'light' | 'dark'
