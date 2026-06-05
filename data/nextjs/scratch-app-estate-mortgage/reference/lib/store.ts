import type { Property } from './types'

// In-memory server store for the API routes. SEPARATE from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let properties: Property[] = []
let nextId = 1

function seed(): void {
  properties = [
    { id: 'p1', address: '12 Oak St', price: 450000 },
    { id: 'p2', address: '500 Pine Ave', price: 320000 },
    { id: 'p3', address: '88 Maple Rd', price: 510000 },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listProperties(): Property[] {
  return properties.slice()
}

export function findProperty(id: string): Property | undefined {
  return properties.find((p) => p.id === id)
}

export function createProperty(input: { address: string; price?: number }): Property {
  const property: Property = {
    id: `p${nextId++}`,
    address: input.address,
    price: input.price ?? 0,
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
