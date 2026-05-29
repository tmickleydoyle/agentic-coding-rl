import { useState } from 'react'
import type { Item, CartLine } from '../components/types'

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([])
  const add = (item: Item) =>
    setLines((prev) => {
      const i = prev.findIndex((l) => l.item.id === item.id)
      if (i === -1) return [...prev, { item, qty: 1 }]
      const copy = prev.slice()
      copy[i] = { ...copy[i], qty: copy[i].qty + 1 }
      return copy
    })
  const remove = (id: number) =>
    setLines((prev) => prev.filter((l) => l.item.id !== id))
  const total = lines.reduce((s, l) => s + l.item.price * l.qty, 0)
  return { lines, add, remove, total }
}
