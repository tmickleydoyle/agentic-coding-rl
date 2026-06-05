'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Item, Route } from '../lib/types'

type Ctx = {
  items: Item[]
  route: Route
  navigate: (r: Route) => void
  addItem: (name: string, onHand: string, reorder: string, target: string) => void
  receive: (id: string, amount: string) => void
  sell: (id: string, amount: string) => void
}

export const StockContext = createContext<Ctx | null>(null)

function intOr0(v: string): number {
  const n = Math.floor(parseFloat(v))
  return isFinite(n) && n > 0 ? n : 0
}

export function StockProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const [route, setRoute] = useState<Route>('inventory')
  const [nextId, setNextId] = useState(1)

  function addItem(name: string, onHand: string, reorder: string, target: string) {
    const n = name.trim()
    if (!n) return
    setItems((xs) => [
      ...xs,
      { id: nextId, name: n, onHand: intOr0(onHand), reorder: intOr0(reorder), target: intOr0(target) },
    ])
    setNextId((x) => x + 1)
  }

  function adjust(id: string, amount: string, sign: number) {
    const itemId = parseInt(id, 10)
    const amt = Math.floor(parseFloat(amount))
    if (!isFinite(amt) || amt < 1) return
    setItems((xs) =>
      xs.map((it) => {
        if (it.id !== itemId) return it
        return { ...it, onHand: Math.max(0, it.onHand + sign * amt) }
      }),
    )
  }

  const value: Ctx = {
    items,
    route,
    navigate: setRoute,
    addItem,
    receive: (id, amount) => adjust(id, amount, 1),
    sell: (id, amount) => adjust(id, amount, -1),
  }
  return <StockContext.Provider value={value}>{children}</StockContext.Provider>
}
