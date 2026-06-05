export type Product = {
  id: string
  name: string
  category: string
}

export type Review = {
  id: string
  productId: string
  rating: number
  text: string
  createdAt: number
}

export type SortBy = 'rating' | 'date'

export type Route = 'products' | 'product-reviews' | 'write-review' | 'top-rated'
export type Theme = 'light' | 'dark'
