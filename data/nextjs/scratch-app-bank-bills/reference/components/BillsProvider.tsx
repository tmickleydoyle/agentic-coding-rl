'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_BILLS: Bill[] = [
  { id: 'b1', name: 'Rent', amount: 1400, dueDay: 1, paid: false, autopay: false },
  { id: 'b2', name: 'Internet', amount: 60, dueDay: 5, paid: true, autopay: true },
  { id: 'b3', name: 'Phone', amount: 45, dueDay: 15, paid: false, autopay: true },
  { id: 'b4', name: 'Gym', amount: 30, dueDay: 20, paid: false, autopay: false },
]

export function BillsProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>(SEED_BILLS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('bills')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextBillId, setNextBillId] = useState(5)
  const today = 10

  const value = useMemo<BillsApi>(() => {
    const addBill = (input: NewBillInput) => {
      const id = `b${nextBillId}`
      setNextBillId((n) => n + 1)
      setBills((prev) => [
        ...prev,
        {
          id,
          name: input.name,
          amount: input.amount,
          dueDay: input.dueDay,
          paid: false,
          autopay: input.autopay ?? false,
        },
      ])
    }

    const payBill = (id: string) => {
      setBills((prev) => prev.map((b) => (b.id === id ? { ...b, paid: true } : b)))
    }

    const toggleAutopay = (id: string) => {
      setBills((prev) =>
        prev.map((b) => (b.id === id ? { ...b, autopay: !b.autopay } : b)),
      )
    }

    const select = (id: string) => {
      setSelectedId(id)
      setRoute('bill-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      bills,
      theme,
      route,
      today,
      selectedId,
      addBill,
      payBill,
      toggleAutopay,
      select,
      setTheme,
      navigate,
    }
  }, [bills, theme, route, selectedId, nextBillId])

  return <BillsContext.Provider value={value}>{children}</BillsContext.Provider>
}

export function useBills(): BillsApi {
  const v = useContext(BillsContext)
  if (!v) throw new Error('useBills must be used within a BillsProvider')
  return v
}
