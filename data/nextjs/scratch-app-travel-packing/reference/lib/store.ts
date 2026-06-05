import type { Category, Item, Trip } from './types'

// In-memory server store for the API routes. SEPARATE from the client provider state.
// Tests call __reset() in beforeEach so each test starts from the same seed.

let trips: Trip[] = []
let items: Item[] = []
let nextItemId = 1

function seed(): void {
  trips = [
    { id: 'tr1', name: 'Beach Weekend' },
    { id: 'tr2', name: 'Ski Trip' },
  ]
  items = [
    { id: 'i1', tripId: 'tr1', name: 'Swimsuit', category: 'clothing', packed: true },
    { id: 'i2', tripId: 'tr1', name: 'Sunscreen', category: 'toiletries', packed: false },
    { id: 'i3', tripId: 'tr1', name: 'Passport', category: 'documents', packed: false },
    { id: 'i4', tripId: 'tr2', name: 'Gloves', category: 'clothing', packed: false },
  ]
  nextItemId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listTrips(): Trip[] {
  return trips.slice()
}

export function findTrip(id: string): Trip | undefined {
  return trips.find((t) => t.id === id)
}

export function listItems(filter?: { tripId?: string | null }): Item[] {
  let out = items.slice()
  const tripId = filter?.tripId
  if (tripId) out = out.filter((i) => i.tripId === tripId)
  return out
}

export function findItem(id: string): Item | undefined {
  return items.find((i) => i.id === id)
}

export function createItem(input: {
  tripId: string
  name: string
  category?: Category
}): Item {
  const item: Item = {
    id: `i${nextItemId++}`,
    tripId: input.tripId,
    name: input.name,
    category: input.category ?? 'other',
    packed: false,
  }
  items.push(item)
  return item
}

export function updateItem(id: string, patch: { packed?: boolean }): Item | undefined {
  const item = items.find((i) => i.id === id)
  if (!item) return undefined
  if (typeof patch.packed === 'boolean') item.packed = patch.packed
  return item
}

export function deleteItem(id: string): boolean {
  const idx = items.findIndex((i) => i.id === id)
  if (idx === -1) return false
  items.splice(idx, 1)
  return true
}

export function packedPercent(tripId: string): number {
  const tripItems = items.filter((i) => i.tripId === tripId)
  if (tripItems.length === 0) return 0
  const packed = tripItems.filter((i) => i.packed).length
  return Math.round((packed / tripItems.length) * 100)
}
