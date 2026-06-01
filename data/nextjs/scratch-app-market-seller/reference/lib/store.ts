import type { Order, Product } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.

let products: Product[] = []
let orders: Order[] = []
let nextProductId = 1

function seed(): void {
  products = [
    { id: 'p1', name: 'Mug', price: 12, stock: 100 },
    { id: 'p2', name: 'T-shirt', price: 25, stock: 40 },
    { id: 'p3', name: 'Sticker', price: 3, stock: 500 },
  ]
  orders = [
    { id: 'o1', productId: 'p1', qty: 2, fulfilled: true },
    { id: 'o2', productId: 'p2', qty: 1, fulfilled: false },
    { id: 'o3', productId: 'p1', qty: 3, fulfilled: false },
  ]
  nextProductId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listProducts(filter?: { inStock?: string | null }): Product[] {
  let out = products.slice()
  if (filter?.inStock === 'true') out = out.filter((p) => p.stock > 0)
  return out
}

export function createProduct(input: { name: string; price?: number; stock?: number }): Product {
  const product: Product = {
    id: `p${nextProductId++}`,
    name: input.name,
    price: input.price ?? 0,
    stock: input.stock ?? 0,
  }
  products.push(product)
  return product
}

export function listOrders(filter?: { fulfilled?: string | null }): Order[] {
  let out = orders.slice()
  const f = filter?.fulfilled
  if (f === 'true') out = out.filter((o) => o.fulfilled)
  else if (f === 'false') out = out.filter((o) => !o.fulfilled)
  return out
}

export function fulfillOrder(id: string): Order | undefined {
  const order = orders.find((o) => o.id === id)
  if (!order) return undefined
  order.fulfilled = true
  return order
}
