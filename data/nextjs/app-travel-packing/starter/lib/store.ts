import type { Category, Item, Trip } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level trips/items + an id counter; seed them; provide __reset().

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listTrips(): Trip[] {
  // TODO: return all trips
  return []
}

export function findTrip(_id: string): Trip | undefined {
  // TODO: look up a trip by id
  return undefined
}

export function listItems(_filter?: { tripId?: string | null }): Item[] {
  // TODO: return items, optionally filtered by tripId
  return []
}

export function findItem(_id: string): Item | undefined {
  // TODO: look up an item by id
  return undefined
}

export function createItem(_input: {
  tripId: string
  name: string
  category?: Category
}): Item {
  // TODO: append a new item with a fresh id and return it
  return { id: '', tripId: '', name: '', category: 'other', packed: false }
}

export function updateItem(_id: string, _patch: { packed?: boolean }): Item | undefined {
  // TODO: apply the patch and return the updated item, or undefined if absent
  return undefined
}

export function deleteItem(_id: string): boolean {
  // TODO: remove the item; return whether it existed
  return false
}

export function packedPercent(_tripId: string): number {
  // TODO: rounded percent of the trip's items that are packed (0 when none)
  return 0
}
