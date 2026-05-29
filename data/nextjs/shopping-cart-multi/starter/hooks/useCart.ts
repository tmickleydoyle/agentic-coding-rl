import { useState } from 'react'
import type { Item, CartLine } from '../components/types'

// TODO: track lines: CartLine[]. add(item): increment qty if present, else push qty:1.
// remove(id): drop the line. total: sum of price*qty across lines.
export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([])
  return { lines, add: (_i: Item) => {}, remove: (_id: number) => {}, total: 0 }
}
