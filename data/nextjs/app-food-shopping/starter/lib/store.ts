import type { Item } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `items` + id counter; seed them; provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listItems(_filter?: {
  aisle?: string | null
  bought?: string | null
}): Item[] {
  // TODO: return items, applying optional aisle + bought filters
  return []
}

export function createItem(_input: { name: string; aisle?: string; qty?: number }): Item {
  // TODO: append a new item with a fresh id and return it
  return { id: '', name: '', aisle: '', qty: 0, bought: false }
}

export function findItem(_id: string): Item | undefined {
  // TODO: look up an item by id
  return undefined
}

export function updateItem(
  _id: string,
  _patch: { bought?: boolean; name?: string; aisle?: string; qty?: number },
): Item | undefined {
  // TODO: apply the patch (toggle bought when none given) and return the item
  return undefined
}

export function deleteItem(_id: string): boolean {
  // TODO: remove the item; return whether it existed
  return false
}
