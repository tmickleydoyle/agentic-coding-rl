import type { Item } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state. Tests call __reset() in beforeEach for isolation.

let items: Item[] = []
let nextId = 1

function seed(): void {
  items = [
    { id: 'i1', name: 'Milk', aisle: 'Dairy', qty: 1, bought: false },
    { id: 'i2', name: 'Apples', aisle: 'Produce', qty: 6, bought: false },
    { id: 'i3', name: 'Cheddar', aisle: 'Dairy', qty: 1, bought: true },
    { id: 'i4', name: 'Bananas', aisle: 'Produce', qty: 3, bought: false },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listItems(filter?: {
  aisle?: string | null
  bought?: string | null
}): Item[] {
  let out = items.slice()
  const aisle = filter?.aisle
  if (aisle) out = out.filter((i) => i.aisle === aisle)
  const bought = filter?.bought
  if (bought === 'true') out = out.filter((i) => i.bought)
  else if (bought === 'false') out = out.filter((i) => !i.bought)
  return out
}

export function createItem(input: { name: string; aisle?: string; qty?: number }): Item {
  const item: Item = {
    id: `i${nextId++}`,
    name: input.name,
    aisle: input.aisle ?? 'Other',
    qty: input.qty ?? 1,
    bought: false,
  }
  items.push(item)
  return item
}

export function findItem(id: string): Item | undefined {
  return items.find((i) => i.id === id)
}

export function updateItem(
  id: string,
  patch: { bought?: boolean; name?: string; aisle?: string; qty?: number },
): Item | undefined {
  const item = items.find((i) => i.id === id)
  if (!item) return undefined
  if (typeof patch.bought === 'boolean') item.bought = patch.bought
  if (typeof patch.name === 'string') item.name = patch.name
  if (typeof patch.aisle === 'string') item.aisle = patch.aisle
  if (typeof patch.qty === 'number') item.qty = patch.qty
  return item
}

export function deleteItem(id: string): boolean {
  const idx = items.findIndex((i) => i.id === id)
  if (idx === -1) return false
  items.splice(idx, 1)
  return true
}
