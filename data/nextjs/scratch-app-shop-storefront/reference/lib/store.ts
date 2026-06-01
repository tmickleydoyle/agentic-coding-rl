import type { Product } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let products: Product[] = []
let nextId = 1

function seed(): void {
  products = [
    { id: 's1', name: 'Aero Mug', category: 'kitchen', price: 12 },
    { id: 's2', name: 'Desk Lamp', category: 'office', price: 30 },
    { id: 's3', name: 'Notebook', category: 'office', price: 6 },
    { id: 's4', name: 'Chef Knife', category: 'kitchen', price: 45 },
    { id: 's5', name: 'Yoga Mat', category: 'fitness', price: 25 },
  ]
  nextId = 6
}

seed()

export function __reset(): void {
  seed()
}

export function listProducts(filter?: { category?: string | null; maxPrice?: string | null }): Product[] {
  let out = products.slice()
  const category = filter?.category
  if (category) out = out.filter((p) => p.category === category)
  const maxPrice = filter?.maxPrice
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
    const n = Number(maxPrice)
    if (!Number.isNaN(n)) out = out.filter((p) => p.price <= n)
  }
  return out
}

export function createProduct(input: { name: string; category?: string; price: number }): Product {
  const product: Product = {
    id: `s${nextId++}`,
    name: input.name,
    category: input.category ?? 'general',
    price: input.price,
  }
  products.push(product)
  return product
}

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function deleteProduct(id: string): boolean {
  const idx = products.findIndex((p) => p.id === id)
  if (idx === -1) return false
  products.splice(idx, 1)
  return true
}
