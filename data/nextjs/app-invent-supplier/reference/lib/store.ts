import type { Product, Supplier } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.
// Tests call __reset() in beforeEach for isolation.

let suppliers: Supplier[] = []
let products: Product[] = []
let nextSupplierId = 1

function seed(): void {
  suppliers = [
    { id: 's1', name: 'Acme Parts', category: 'Hardware', leadTimeDays: 5, rating: 4.5 },
    { id: 's2', name: 'Global Foods', category: 'Food', leadTimeDays: 12, rating: 3.8 },
    { id: 's3', name: 'TextilePro', category: 'Apparel', leadTimeDays: 7, rating: 4.2 },
  ]
  products = [
    { id: 'pr1', name: 'M4 Bolt', supplierId: 's1', price: 0.1 },
    { id: 'pr2', name: 'Steel Hinge', supplierId: 's1', price: 2.5 },
    { id: 'pr3', name: 'Olive Oil', supplierId: 's2', price: 9.0 },
    { id: 'pr4', name: 'Cotton Roll', supplierId: 's3', price: 14.0 },
  ]
  nextSupplierId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listSuppliers(filter?: { category?: string | null }): Supplier[] {
  let out = suppliers.slice()
  const category = filter?.category
  if (category) out = out.filter((s) => s.category === category)
  return out
}

export function findSupplier(id: string): Supplier | undefined {
  return suppliers.find((s) => s.id === id)
}

export function productsForSupplier(id: string): Product[] {
  return products.filter((p) => p.supplierId === id)
}

export function createSupplier(input: {
  name: string
  category: string
  leadTimeDays: number
  rating?: number
}): Supplier {
  const supplier: Supplier = {
    id: `s${nextSupplierId++}`,
    name: input.name,
    category: input.category,
    leadTimeDays: input.leadTimeDays,
    rating: input.rating ?? 0,
  }
  suppliers.push(supplier)
  return supplier
}
