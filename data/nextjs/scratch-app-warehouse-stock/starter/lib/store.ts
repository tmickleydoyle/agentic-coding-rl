import { Location, InventoryItem, Movement } from './types'

export function __reset() {}
export function getLocations(): Location[] { return [] }
export function addLocation(_d: Omit<Location, 'id'>): Location { return {} as Location }
export function getInventory(): InventoryItem[] { return [] }
export function addInventoryItem(_d: Omit<InventoryItem, 'id'>): InventoryItem { return {} as InventoryItem }
export function adjustQuantity(_id: string, _q: number): InventoryItem | null { return null }
export function getMovements(): Movement[] { return [] }
export function addMovement(_d: Omit<Movement, 'id' | 'date'>): Movement { return {} as Movement }
