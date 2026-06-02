'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Ticket } from '../lib/types'
import { STAGES } from '../lib/types'

type Ctx = {
  route: Route
  navigate: (r: Route) => void
  tickets: Ticket[]
  addTicket: (table: string, item: string) => void
  advance: (id: number) => void
}

export const AppContext = createContext<Ctx | null>(null)

export function Provider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('queue')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [nextId, setNextId] = useState(1)

  function addTicket(table: string, item: string) {
    const t = Number(table)
    const it = item.trim()
    if (!it || !Number.isInteger(t) || t < 1) return
    setTickets((arr) => [...arr, { id: nextId, num: nextId, table: t, item: it, stage: 'Queued' }])
    setNextId((n) => n + 1)
  }

  function advance(id: number) {
    setTickets((arr) =>
      arr.map((tk) => {
        if (tk.id !== id) return tk
        const i = STAGES.indexOf(tk.stage)
        if (i >= STAGES.length - 1) return tk
        return { ...tk, stage: STAGES[i + 1] }
      })
    )
  }

  const value: Ctx = { route, navigate: setRoute, tickets, addTicket, advance }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
