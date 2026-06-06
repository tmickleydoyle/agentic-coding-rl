export interface Category {
  id: string
  name: string
  description: string
}

export interface Product {
  id: string
  name: string
  sku: string
  price: number
  categoryId: string
  stock: number
  active: boolean
}

export interface Review {
  id: string
  productId: string
  rating: number
  comment: string
  reviewer: string
}

export type Route = 'home' | 'products' | 'categories' | 'reviews'
