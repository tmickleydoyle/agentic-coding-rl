'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Dish, Ticket } from '../lib/types'

type Ctx = {
  route: Route
  navigate: (r: Route) => void
  dishes: Dish[]
  tickets: Ticket[]
  addDish: (name: string, price: string) => void
  addTicket: (dishId: string, qty: string) => void
}

export const AppContext = createContext<Ctx | null>(null)

export function Provider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('menu')
  const [dishes, setDishes] = useState<Dish[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [nextDish, setNextDish] = useState(1)
  const [nextTicket, setNextTicket] = useState(1)

  function addDish(name: string, price: string) {
    const p = parseFloat(price)
    const n = name.trim()
    if (!n || !isFinite(p) || p <= 0) return
    setDishes((d) => [...d, { id: nextDish, name: n, price: p }])
    setNextDish((x) => x + 1)
  }

  function addTicket(dishId: string, qty: string) {
    const id = parseInt(dishId, 10)
    const q = Number(qty)
    if (!dishes.some((d) => d.id === id)) return
    if (!Number.isInteger(q) || q < 1) return
    setTickets((t) => [...t, { id: nextTicket, dishId: id, qty: q }])
    setNextTicket((x) => x + 1)
  }

  const value: Ctx = { route, navigate: setRoute, dishes, tickets, addDish, addTicket }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
