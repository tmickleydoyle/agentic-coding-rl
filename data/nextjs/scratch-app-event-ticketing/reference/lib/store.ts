import type { EventItem, Order } from './types'

// In-memory server store for the API routes. Separate from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let events: EventItem[] = []
let orders: Order[] = []
let nextId = 2

function seed(): void {
  events = [
    {
      id: 'e1',
      name: 'Synth Fest',
      date: '2026-07-01',
      venue: 'Hall A',
      tiers: [
        { id: 't1', name: 'GA', price: 50, capacity: 100, sold: 20 },
        { id: 't2', name: 'VIP', price: 120, capacity: 10, sold: 10 },
      ],
    },
    {
      id: 'e2',
      name: 'Code Camp',
      date: '2026-08-15',
      venue: 'Hall B',
      tiers: [{ id: 't3', name: 'GA', price: 30, capacity: 50, sold: 0 }],
    },
  ]
  orders = [{ id: 'o1', eventId: 'e1', tierId: 't1', qty: 2, buyer: 'Ada', total: 100 }]
  nextId = 2
}

seed()

export function __reset(): void {
  seed()
}

export function listEvents(id?: string | null): EventItem[] {
  if (id) return events.filter((e) => e.id === id)
  return events.slice()
}

export function findEvent(id: string): EventItem | undefined {
  return events.find((e) => e.id === id)
}

export function findTier(eventId: string, tierId: string) {
  const event = findEvent(eventId)
  if (!event) return undefined
  return event.tiers.find((t) => t.id === tierId)
}

export function listOrders(eventId?: string | null): Order[] {
  if (eventId) return orders.filter((o) => o.eventId === eventId)
  return orders.slice()
}

export function createOrder(input: {
  eventId: string
  tierId: string
  qty: number
  buyer: string
}): Order {
  const tier = findTier(input.eventId, input.tierId)
  const price = tier ? tier.price : 0
  if (tier) tier.sold += input.qty
  const order: Order = {
    id: `o${nextId++}`,
    eventId: input.eventId,
    tierId: input.tierId,
    qty: input.qty,
    buyer: input.buyer,
    total: price * input.qty,
  }
  orders.push(order)
  return order
}

export function deleteOrder(id: string): boolean {
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return false
  const order = orders[idx]
  const tier = findTier(order.eventId, order.tierId)
  if (tier) tier.sold = Math.max(0, tier.sold - order.qty)
  orders.splice(idx, 1)
  return true
}
