import { Category, Product, Review } from './types'

export function __reset() {}
export function getCategories(): Category[] { return [] }
export function addCategory(_d: Omit<Category, 'id'>): Category { return {} as Category }
export function getProducts(): Product[] { return [] }
export function addProduct(_d: Omit<Product, 'id' | 'active'>): Product { return {} as Product }
export function toggleProduct(_id: string): Product | null { return null }
export function getReviews(): Review[] { return [] }
export function addReview(_d: Omit<Review, 'id'>): Review { return {} as Review }
