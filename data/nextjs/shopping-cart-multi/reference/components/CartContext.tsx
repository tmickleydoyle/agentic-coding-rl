'use client'
import { createContext, useContext } from 'react'
import type { Item, CartLine } from './types'

export type CartApi = {
  lines: CartLine[]
  add: (item: Item) => void
  remove: (id: number) => void
  total: number
}

export const CartContext = createContext<CartApi | null>(null)

export function useCartContext(): CartApi {
  const v = useContext(CartContext)
  if (!v) throw new Error('CartContext not provided')
  return v
}
