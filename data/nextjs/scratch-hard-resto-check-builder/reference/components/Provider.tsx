'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Item, Line } from '../lib/types'

type Ctx = {
  route: Route
  navigate: (r: Route) => void
  items: Item[]
  lines: Line[]
  discount: number
  setDiscount: (raw: string) => void
  addItem: (name: string, price: string) => void
  addLine: (itemId: string, qty: string) => void
  itemById: (id: number) => Item | undefined
}

export const AppContext = createContext<Ctx | null>(null)

export function Provider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('items')
  const [items, setItems] = useState<Item[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [discount, setDiscountState] = useState(0)
  const [nextItem, setNextItem] = useState(1)
  const [nextLine, setNextLine] = useState(1)

  function addItem(name: string, price: string) {
    const p = parseFloat(price)
    const n = name.trim()
    if (!n || !isFinite(p) || p <= 0) return
    setItems((a) => [...a, { id: nextItem, name: n, price: p }])
    setNextItem((x) => x + 1)
  }

  function addLine(itemId: string, qty: string) {
    const id = parseInt(itemId, 10)
    const q = Number(qty)
    if (!items.some((i) => i.id === id)) return
    if (!Number.isInteger(q) || q < 1) return
    setLines((a) => [...a, { id: nextLine, itemId: id, qty: q }])
    setNextLine((x) => x + 1)
  }

  function setDiscount(raw: string) {
    const d = parseInt(raw, 10)
    if (!Number.isFinite(d) || isNaN(d) || d < 0) {
      setDiscountState(0)
      return
    }
    setDiscountState(Math.min(100, d))
  }

  const itemById = (id: number) => items.find((i) => i.id === id)

  const value: Ctx = {
    route,
    navigate: setRoute,
    items,
    lines,
    discount,
    setDiscount,
    addItem,
    addLine,
    itemById,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
