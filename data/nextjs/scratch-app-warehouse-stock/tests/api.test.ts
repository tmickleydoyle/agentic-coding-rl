import { describe, it, expect, beforeEach } from 'vitest'
import { __reset, getLocations, addLocation, getInventory, addInventoryItem, getMovements, addMovement } from '../lib/store'

beforeEach(() => { __reset() })

describe('Store API', () => {
  it('getLocations returns 4 seed locations', () => {
    expect(getLocations().length).toBe(4)
  })

  it('addLocation increments list', () => {
    addLocation({ code: 'C1-01', zone: 'Zone C', capacity: 200 })
    expect(getLocations().length).toBe(5)
  })

  it('getInventory returns 5 seed items', () => {
    expect(getInventory().length).toBe(5)
  })

  it('two items are low stock (< 10)', () => {
    const lowStock = getInventory().filter(i => i.quantity < 10)
    expect(lowStock.length).toBe(2)
  })

  it('addInventoryItem increments list', () => {
    addInventoryItem({ name: 'X', sku: 'X001', quantity: 50, locationId: 'loc1', category: 'Test' })
    expect(getInventory().length).toBe(6)
  })

  it('getMovements returns 3 seed movements', () => {
    expect(getMovements().length).toBe(3)
  })

  it('inbound movement increases item quantity', () => {
    const before = getInventory().find(i => i.id === 'inv1')!.quantity
    addMovement({ itemId: 'inv1', type: 'inbound', quantity: 10, notes: 'Test' })
    expect(getInventory().find(i => i.id === 'inv1')!.quantity).toBe(before + 10)
  })

  it('outbound movement decreases item quantity', () => {
    const before = getInventory().find(i => i.id === 'inv1')!.quantity
    addMovement({ itemId: 'inv1', type: 'outbound', quantity: 5, notes: 'Test' })
    expect(getInventory().find(i => i.id === 'inv1')!.quantity).toBe(before - 5)
  })
})
