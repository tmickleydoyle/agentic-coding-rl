import type { Product } from './types'

// In-memory server store for the API routes. SEPARATE from the client Context state.
// Tests call __reset() in beforeEach for isolation.

let products: Product[] = []
let nextId = 1

function seed(): void {
  products = [
    { id: 'p1', name: 'Widget', qty: 40, reorderPoint: 10 },
    { id: 'p2', name: 'Gadget', qty: 5, reorderPoint: 8 },
    { id: 'p3', name: 'Sprocket', qty: 0, reorderPoint: 4 },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listProducts(filter?: { low?: string | null }): Product[] {
  let out = products.slice()
  if (filter?.low === 'true') out = out.filter((p) => p.qty <= p.reorderPoint)
  return out
}

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function createProduct(input: {
  name: string
  qty: number
  reorderPoint: number
}): Product {
  const product: Product = {
    id: `p${nextId++}`,
    name: input.name,
    qty: input.qty,
    reorderPoint: input.reorderPoint,
  }
  products.push(product)
  return product
}

export function adjustProduct(id: string, delta: number): Product | undefined {
  const product = products.find((p) => p.id === id)
  if (!product) return undefined
  product.qty = Math.max(0, product.qty + delta)
  return product
}
