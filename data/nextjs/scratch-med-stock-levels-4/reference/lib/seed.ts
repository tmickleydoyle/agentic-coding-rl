import type { Product } from './types'

export const SEED_PRODUCTS: Product[] = [
  { id: 1, name: 'Widget A', price: 2.50, onHand: 20, reorderAt: 10 },
  { id: 2, name: 'Gadget B', price: 15.00, onHand: 5, reorderAt: 8 },
  { id: 3, name: 'Doohickey C', price: 7.75, onHand: 8, reorderAt: 15 },
]
