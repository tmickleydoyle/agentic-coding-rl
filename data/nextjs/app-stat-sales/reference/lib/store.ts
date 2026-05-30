import type { Order, Region } from './types'
import { REGIONS } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let orders: Order[] = []
let nextOrderId = 1

function seed(): void {
  orders = [
    { id: 'o1', product: 'Widget', region: 'NA', revenue: 1000, units: 10, month: 'Jan' },
    { id: 'o2', product: 'Widget', region: 'EU', revenue: 500, units: 5, month: 'Feb' },
    { id: 'o3', product: 'Gadget', region: 'NA', revenue: 800, units: 4, month: 'Jan' },
    { id: 'o4', product: 'Gadget', region: 'APAC', revenue: 1200, units: 6, month: 'Mar' },
    { id: 'o5', product: 'Gizmo', region: 'EU', revenue: 300, units: 3, month: 'Feb' },
    { id: 'o6', product: 'Widget', region: 'APAC', revenue: 700, units: 7, month: 'Mar' },
  ]
  nextOrderId = 7
}

seed()

export function __reset(): void {
  seed()
}

export function isRegion(v: unknown): v is Region {
  return v === 'NA' || v === 'EU' || v === 'APAC'
}

export function listOrders(filter?: { region?: string | null; product?: string | null }): Order[] {
  let out = orders.slice()
  const region = filter?.region
  if (isRegion(region)) out = out.filter((o) => o.region === region)
  const product = filter?.product
  if (product) out = out.filter((o) => o.product === product)
  return out
}

export function summarizeByRegion(input: Order[]): { region: Region; revenue: number; units: number }[] {
  return REGIONS.map((region) => {
    let revenue = 0
    let units = 0
    input.forEach((o) => {
      if (o.region === region) {
        revenue += o.revenue
        units += o.units
      }
    })
    return { region, revenue, units }
  })
}

export function summarizeByProduct(input: Order[]): { product: string; revenue: number; units: number }[] {
  const map: Record<string, { product: string; revenue: number; units: number }> = {}
  input.forEach((o) => {
    if (!map[o.product]) map[o.product] = { product: o.product, revenue: 0, units: 0 }
    map[o.product].revenue += o.revenue
    map[o.product].units += o.units
  })
  const rows = Object.keys(map).map((k) => map[k])
  rows.sort((a, b) => {
    if (b.revenue !== a.revenue) return b.revenue - a.revenue
    return a.product < b.product ? -1 : a.product > b.product ? 1 : 0
  })
  return rows
}

export function createOrder(input: {
  product: string
  region: Region
  revenue?: number
  units?: number
  month?: string
}): Order {
  const order: Order = {
    id: `o${nextOrderId++}`,
    product: input.product,
    region: input.region,
    revenue: input.revenue ?? 0,
    units: input.units ?? 0,
    month: input.month ?? 'Jan',
  }
  orders.push(order)
  return order
}

export function deleteOrder(id: string): boolean {
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return false
  orders.splice(idx, 1)
  return true
}
