import type { Order, OrderStatus } from './types'
import { TIMELINE } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let orders: Order[] = []
let nextId = 1

function seed(): void {
  orders = [
    { id: 'o1', item: 'Aero Mug', total: 12, status: 'delivered' },
    { id: 'o2', item: 'Desk Lamp', total: 30, status: 'shipped' },
    { id: 'o3', item: 'Chef Knife', total: 45, status: 'placed' },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function isStatus(value: unknown): value is OrderStatus {
  return value === 'placed' || value === 'shipped' || value === 'delivered'
}

export function listOrders(filter?: { status?: string | null }): Order[] {
  let out = orders.slice()
  const status = filter?.status
  if (status && isStatus(status)) out = out.filter((o) => o.status === status)
  return out
}

export function createOrder(input: { item: string; total: number }): Order {
  const order: Order = {
    id: `o${nextId++}`,
    item: input.item,
    total: input.total,
    status: 'placed',
  }
  orders.push(order)
  return order
}

export function findOrder(id: string): Order | undefined {
  return orders.find((o) => o.id === id)
}

export function setStatus(id: string, status: OrderStatus): Order | undefined {
  const order = orders.find((o) => o.id === id)
  if (!order) return undefined
  order.status = status
  return order
}

export function statusIndex(status: OrderStatus): number {
  return TIMELINE.indexOf(status)
}
