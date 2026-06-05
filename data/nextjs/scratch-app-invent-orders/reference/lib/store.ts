import type { PurchaseOrder } from './types'
import { orderStatus } from './types'

// In-memory server store for the API routes. SEPARATE from the client Context state.

let orders: PurchaseOrder[] = []
let nextId = 1

function seed(): void {
  orders = [
    { id: 'po1', supplier: 'Acme', item: 'Bolts', ordered: 100, received: 100, cancelled: false },
    { id: 'po2', supplier: 'Acme', item: 'Nuts', ordered: 50, received: 20, cancelled: false },
    { id: 'po3', supplier: 'Globex', item: 'Washers', ordered: 200, received: 0, cancelled: false },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listOrders(filter?: { supplier?: string | null }): PurchaseOrder[] {
  let out = orders.slice()
  const supplier = filter?.supplier
  if (supplier) out = out.filter((o) => o.supplier === supplier)
  return out
}

export function findOrder(id: string): PurchaseOrder | undefined {
  return orders.find((o) => o.id === id)
}

export function createOrder(input: {
  supplier: string
  item: string
  ordered: number
}): PurchaseOrder {
  const order: PurchaseOrder = {
    id: `po${nextId++}`,
    supplier: input.supplier,
    item: input.item,
    ordered: input.ordered,
    received: 0,
    cancelled: false,
  }
  orders.push(order)
  return order
}

export function receiveOrder(id: string, qty: number): PurchaseOrder | undefined {
  const order = orders.find((o) => o.id === id)
  if (!order || order.cancelled) return order
  order.received = Math.min(order.ordered, order.received + Math.max(0, qty))
  return order
}

export function cancelOrder(id: string): PurchaseOrder | undefined {
  const order = orders.find((o) => o.id === id)
  if (!order) return undefined
  order.cancelled = true
  return order
}

export function statusOf(order: PurchaseOrder): string {
  return orderStatus(order)
}
