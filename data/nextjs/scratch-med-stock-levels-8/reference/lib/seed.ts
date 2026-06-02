import type { Product } from './types'

export const SEED: Omit<Product, 'id'>[] = [
  { name: 'Widget A', onHand: 50, reorderPoint: 20, unitPrice: 4.99 },
  { name: 'Gadget B', onHand: 8, reorderPoint: 15, unitPrice: 12.50 },
  { name: 'Doohickey C', onHand: 100, reorderPoint: 30, unitPrice: 1.75 },
]
