import { Category, Product, Review } from './types'

const seedCategories: Category[] = [
  { id: 'c1', name: 'Electronics', description: 'Electronic devices and accessories' },
  { id: 'c2', name: 'Books', description: 'Physical and digital books' },
  { id: 'c3', name: 'Clothing', description: 'Apparel and accessories' },
]

const seedProducts: Product[] = [
  { id: 'p1', name: 'Wireless Headphones', sku: 'SKU001', price: 79.99, categoryId: 'c1', stock: 45, active: true },
  { id: 'p2', name: 'TypeScript Handbook', sku: 'SKU002', price: 39.99, categoryId: 'c2', stock: 120, active: true },
  { id: 'p3', name: 'Running Shoes', sku: 'SKU003', price: 129.99, categoryId: 'c3', stock: 30, active: true },
  { id: 'p4', name: 'USB-C Hub', sku: 'SKU004', price: 49.99, categoryId: 'c1', stock: 0, active: false },
  { id: 'p5', name: 'Cotton T-Shirt', sku: 'SKU005', price: 24.99, categoryId: 'c3', stock: 200, active: true },
]

const seedReviews: Review[] = [
  { id: 'rv1', productId: 'p1', rating: 5, comment: 'Excellent sound quality!', reviewer: 'John D.' },
  { id: 'rv2', productId: 'p1', rating: 4, comment: 'Good value for money', reviewer: 'Sara M.' },
  { id: 'rv3', productId: 'p2', rating: 5, comment: 'Best TypeScript resource', reviewer: 'Dev K.' },
  { id: 'rv4', productId: 'p3', rating: 3, comment: 'Comfortable but sizing runs small', reviewer: 'Lisa P.' },
]

let categories: Category[] = seedCategories.map(c => ({ ...c }))
let products: Product[] = seedProducts.map(p => ({ ...p }))
let reviews: Review[] = seedReviews.map(r => ({ ...r }))
let nextId = 100

export function __reset() {
  categories = seedCategories.map(c => ({ ...c }))
  products = seedProducts.map(p => ({ ...p }))
  reviews = seedReviews.map(r => ({ ...r }))
  nextId = 100
}

export function getCategories(): Category[] { return categories }
export function addCategory(data: Omit<Category, 'id'>): Category {
  const c: Category = { ...data, id: `c${nextId++}` }
  categories.push(c)
  return c
}

export function getProducts(): Product[] { return products }
export function addProduct(data: Omit<Product, 'id' | 'active'>): Product {
  const p: Product = { ...data, id: `p${nextId++}`, active: true }
  products.push(p)
  return p
}
export function toggleProduct(id: string): Product | null {
  const p = products.find(x => x.id === id)
  if (!p) return null
  p.active = !p.active
  return p
}

export function getReviews(): Review[] { return reviews }
export function addReview(data: Omit<Review, 'id'>): Review {
  const r: Review = { ...data, id: `rv${nextId++}` }
  reviews.push(r)
  return r
}
