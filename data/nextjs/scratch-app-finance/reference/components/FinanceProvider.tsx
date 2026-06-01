'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Txn, TxnType } from '../lib/types'

type Ctx = {
  txns: Txn[]
  theme: 'light' | 'dark'
  expensesOnly: boolean
  route: Route
  navigate: (r: Route) => void
  addTxn: (description: string, category: string, amount: string, type: TxnType) => void
  toggleTheme: () => void
  toggleExpensesOnly: () => void
}

export const FinanceContext = createContext<Ctx | null>(null)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [txns, setTxns] = useState<Txn[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [expensesOnly, setExpensesOnly] = useState(false)
  const [route, setRoute] = useState<Route>('transactions')
  const [nextId, setNextId] = useState(1)

  function addTxn(description: string, category: string, amount: string, type: TxnType) {
    const amt = parseFloat(amount)
    if (!isFinite(amt) || amt <= 0) return
    setTxns((t) => [
      ...t,
      { id: nextId, description: description.trim(), category, amount: amt, type },
    ])
    setNextId((n) => n + 1)
  }

  const value: Ctx = {
    txns,
    theme,
    expensesOnly,
    route,
    navigate: setRoute,
    addTxn,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleExpensesOnly: () => setExpensesOnly((s) => !s),
  }
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}
