import type { Category, Listing } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.

let listings: Listing[] = []
let nextId = 1

function seed(): void {
  listings = [
    { id: 'l1', title: 'iPhone 12', category: 'electronics', price: 400, seller: 'alice', description: 'Used phone, good condition.' },
    { id: 'l2', title: 'Oak desk', category: 'furniture', price: 150, seller: 'bob', description: 'Solid oak writing desk.' },
    { id: 'l3', title: 'Road bike', category: 'vehicles', price: 220, seller: 'carol', description: 'Lightweight road bike.' },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listListings(filter?: { category?: string | null; maxPrice?: string | null }): Listing[] {
  let out = listings.slice()
  const category = filter?.category
  if (category) out = out.filter((l) => l.category === category)
  const maxPrice = filter?.maxPrice
  if (maxPrice != null && maxPrice !== '') {
    const n = Number(maxPrice)
    if (!Number.isNaN(n)) out = out.filter((l) => l.price <= n)
  }
  return out
}

export function createListing(input: {
  title: string
  category?: Category
  price?: number
  seller?: string
  description?: string
}): Listing {
  const listing: Listing = {
    id: `l${nextId++}`,
    title: input.title,
    category: input.category ?? 'misc',
    price: input.price ?? 0,
    seller: input.seller ?? 'unknown',
    description: input.description ?? '',
  }
  listings.push(listing)
  return listing
}

export function deleteListing(id: string): boolean {
  const idx = listings.findIndex((l) => l.id === id)
  if (idx === -1) return false
  listings.splice(idx, 1)
  return true
}
