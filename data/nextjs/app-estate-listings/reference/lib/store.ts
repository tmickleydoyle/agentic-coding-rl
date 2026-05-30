import type { Property } from './types'

// In-memory server store for the API routes. SEPARATE from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let properties: Property[] = []
let nextId = 1

function seed(): void {
  properties = [
    { id: 'h1', address: '12 Oak St', type: 'house', price: 450000, beds: 3, baths: 2 },
    { id: 'h2', address: '500 Pine Ave', type: 'condo', price: 320000, beds: 2, baths: 1 },
    { id: 'h3', address: '88 Maple Rd', type: 'townhouse', price: 510000, beds: 4, baths: 3 },
    { id: 'h4', address: '7 Birch Ln', type: 'house', price: 615000, beds: 5, baths: 4 },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listProperties(filter?: {
  type?: string | null
  minBeds?: string | null
  maxPrice?: string | null
}): Property[] {
  let out = properties.slice()
  const type = filter?.type
  if (type && type !== 'all') out = out.filter((p) => p.type === type)
  const minBeds = filter?.minBeds
  if (minBeds != null && minBeds !== '') {
    const n = Number(minBeds)
    if (!Number.isNaN(n)) out = out.filter((p) => p.beds >= n)
  }
  const maxPrice = filter?.maxPrice
  if (maxPrice != null && maxPrice !== '') {
    const n = Number(maxPrice)
    if (!Number.isNaN(n)) out = out.filter((p) => p.price <= n)
  }
  return out
}

export function findProperty(id: string): Property | undefined {
  return properties.find((p) => p.id === id)
}

export function createProperty(input: {
  address: string
  type?: string
  price?: number
  beds?: number
  baths?: number
}): Property {
  const type = (input.type ?? 'house') as Property['type']
  const property: Property = {
    id: `h${nextId++}`,
    address: input.address,
    type,
    price: input.price ?? 0,
    beds: input.beds ?? 0,
    baths: input.baths ?? 0,
  }
  properties.push(property)
  return property
}

export function deleteProperty(id: string): boolean {
  const idx = properties.findIndex((p) => p.id === id)
  if (idx === -1) return false
  properties.splice(idx, 1)
  return true
}
