'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Bill, Route, Theme } from '../lib/types'

type NewBillInput = {
  name: string
  amount: number
  dueDay: number
  autopay?: boolean
}

type BillsApi = {
  bills: Bill[]
  theme: Theme
  route: Route
  today: number
  selectedId: string | null
  addBill: (input: NewBillInput) => void
  payBill: (id: string) => void
  toggleAutopay: (id: string) => void
  select: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const BillsContext = createContext<BillsApi | null>(null)

const STUB: BillsApi = {
  bills: [],
  theme: 'light',
  route: 'bills',
  today: 10,
  selectedId: null,
  addBill: () => {},
  payBill: () => {},
  toggleAutopay: () => {},
  select: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function BillsProvider({ children }: { children: ReactNode }) {
  // TODO: hold bills/theme/route/selectedId in state (seed 4 bills, today = 10), implement
  // addBill/payBill/toggleAutopay/select and navigation. The STUB below makes the app mount
  // but does nothing — replace it with real state + actions.
  return <BillsContext.Provider value={STUB}>{children}</BillsContext.Provider>
}

export function useBills(): BillsApi {
  const v = useContext(BillsContext)
  if (!v) throw new Error('useBills must be used within a BillsProvider')
  return v
}
