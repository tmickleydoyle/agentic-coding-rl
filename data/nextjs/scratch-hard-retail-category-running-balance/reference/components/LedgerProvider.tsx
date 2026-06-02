'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Entry, Category, EntryType, Route } from '../lib/types'

type Ctx = {
  entries: Entry[]
  route: Route
  navigate: (r: Route) => void
  addEntry: (memo: string, amount: string, category: Category, type: EntryType) => void
}

export const LedgerContext = createContext<Ctx | null>(null)

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [route, setRoute] = useState<Route>('ledger')
  const [nextId, setNextId] = useState(1)

  function addEntry(memo: string, amount: string, category: Category, type: EntryType) {
    const amt = parseFloat(amount)
    if (!isFinite(amt) || amt <= 0) return
    setEntries((es) => [...es, { id: nextId, memo: memo.trim(), amount: amt, category, type }])
    setNextId((x) => x + 1)
  }

  const value: Ctx = { entries, route, navigate: setRoute, addEntry }
  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>
}
