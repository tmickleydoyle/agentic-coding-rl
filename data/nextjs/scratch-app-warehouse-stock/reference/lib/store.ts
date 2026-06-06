import { Location, InventoryItem, Movement } from './types'

const seedLocations: Location[] = [
  { id: 'loc1', code: 'A1-01', zone: 'Zone A', capacity: 500 },
  { id: 'loc2', code: 'A1-02', zone: 'Zone A', capacity: 300 },
  { id: 'loc3', code: 'B2-01', zone: 'Zone B', capacity: 1000 },
  { id: 'loc4', code: 'B2-02', zone: 'Zone B', capacity: 750 },
]

const seedInventory: InventoryItem[] = [
  { id: 'inv1', name: 'Widget A', sku: 'WGT-001', quantity: 150, locationId: 'loc1', category: 'Widgets' },
  { id: 'inv2', name: 'Gadget B', sku: 'GDG-002', quantity: 8, locationId: 'loc2', category: 'Gadgets' },
  { id: 'inv3', name: 'Part C', sku: 'PRT-003', quantity: 500, locationId: 'loc3', category: 'Parts' },
  { id: 'inv4', name: 'Tool D', sku: 'TL-004', quantity: 3, locationId: 'loc4', category: 'Tools' },
  { id: 'inv5', name: 'Component E', sku: 'CMP-005', quantity: 75, locationId: 'loc1', category: 'Components' },
]

const seedMovements: Movement[] = [
  { id: 'mv1', itemId: 'inv1', type: 'inbound', quantity: 50, date: '2024-05-01', notes: 'Restocking' },
  { id: 'mv2', itemId: 'inv2', type: 'outbound', quantity: 5, date: '2024-05-02', notes: 'Order fulfillment' },
  { id: 'mv3', itemId: 'inv3', type: 'inbound', quantity: 200, date: '2024-05-03', notes: 'Bulk purchase' },
]

let locations: Location[] = seedLocations.map(l => ({ ...l }))
let inventory: InventoryItem[] = seedInventory.map(i => ({ ...i }))
let movements: Movement[] = seedMovements.map(m => ({ ...m }))
let nextId = 100

export function __reset() {
  locations = seedLocations.map(l => ({ ...l }))
  inventory = seedInventory.map(i => ({ ...i }))
  movements = seedMovements.map(m => ({ ...m }))
  nextId = 100
}

export function getLocations(): Location[] { return locations }
export function addLocation(data: Omit<Location, 'id'>): Location {
  const l: Location = { ...data, id: `loc${nextId++}` }
  locations.push(l)
  return l
}

export function getInventory(): InventoryItem[] { return inventory }
export function addInventoryItem(data: Omit<InventoryItem, 'id'>): InventoryItem {
  const item: InventoryItem = { ...data, id: `inv${nextId++}` }
  inventory.push(item)
  return item
}
export function adjustQuantity(id: string, quantity: number): InventoryItem | null {
  const item = inventory.find(i => i.id === id)
  if (!item) return null
  item.quantity = quantity
  return item
}

export function getMovements(): Movement[] { return movements }
export function addMovement(data: Omit<Movement, 'id' | 'date'>): Movement {
  const m: Movement = { ...data, id: `mv${nextId++}`, date: new Date().toISOString().slice(0, 10) }
  movements.push(m)
  const item = inventory.find(i => i.id === data.itemId)
  if (item) {
    item.quantity += data.type === 'inbound' ? data.quantity : -data.quantity
  }
  return m
}
