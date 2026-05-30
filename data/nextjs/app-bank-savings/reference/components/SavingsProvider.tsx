'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Currency, Pot, Route, Theme } from '../lib/types'

type MoveInput = { potId: string; amount: number }
type MoveResult = { ok: true } | { ok: false; error: string }

type SavingsApi = {
  pots: Pot[]
  unallocated: number
  theme: Theme
  currency: Currency
  route: Route
  selectedId: string | null
  allocate: (input: MoveInput) => MoveResult
  withdraw: (input: MoveInput) => MoveResult
  createPot: (input: { name: string; goal: number }) => void
  select: (id: string) => void
  setTheme: (theme: Theme) => void
  setCurrency: (currency: Currency) => void
  navigate: (route: Route) => void
}

const SavingsContext = createContext<SavingsApi | null>(null)

const SEED_POTS: Pot[] = [
  { id: 'p1', name: 'Emergency Fund', balance: 1500, goal: 3000 },
  { id: 'p2', name: 'New Laptop', balance: 800, goal: 800 },
  { id: 'p3', name: 'Holiday', balance: 200, goal: 1200 },
]

export function SavingsProvider({ children }: { children: ReactNode }) {
  const [pots, setPots] = useState<Pot[]>(SEED_POTS)
  const [unallocated, setUnallocated] = useState(1000)
  const [theme, setTheme] = useState<Theme>('light')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [route, setRoute] = useState<Route>('pots')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextPotId, setNextPotId] = useState(4)

  const value = useMemo<SavingsApi>(() => {
    const allocate = (input: MoveInput): MoveResult => {
      if (!(input.amount > 0)) return { ok: false, error: 'amount must be positive' }
      const pot = pots.find((p) => p.id === input.potId)
      if (!pot) return { ok: false, error: 'unknown pot' }
      if (input.amount > unallocated) return { ok: false, error: 'insufficient funds' }
      setUnallocated((u) => u - input.amount)
      setPots((prev) =>
        prev.map((p) =>
          p.id === input.potId ? { ...p, balance: p.balance + input.amount } : p,
        ),
      )
      return { ok: true }
    }

    const withdraw = (input: MoveInput): MoveResult => {
      if (!(input.amount > 0)) return { ok: false, error: 'amount must be positive' }
      const pot = pots.find((p) => p.id === input.potId)
      if (!pot) return { ok: false, error: 'unknown pot' }
      if (input.amount > pot.balance) return { ok: false, error: 'insufficient balance' }
      setUnallocated((u) => u + input.amount)
      setPots((prev) =>
        prev.map((p) =>
          p.id === input.potId ? { ...p, balance: p.balance - input.amount } : p,
        ),
      )
      return { ok: true }
    }

    const createPot = (input: { name: string; goal: number }) => {
      const id = `p${nextPotId}`
      setNextPotId((n) => n + 1)
      setPots((prev) => [...prev, { id, name: input.name, balance: 0, goal: input.goal }])
      setRoute('pots')
    }

    const select = (id: string) => {
      setSelectedId(id)
      setRoute('pot-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      pots,
      unallocated,
      theme,
      currency,
      route,
      selectedId,
      allocate,
      withdraw,
      createPot,
      select,
      setTheme,
      setCurrency,
      navigate,
    }
  }, [pots, unallocated, theme, currency, route, selectedId, nextPotId])

  return <SavingsContext.Provider value={value}>{children}</SavingsContext.Provider>
}

export function useSavings(): SavingsApi {
  const v = useContext(SavingsContext)
  if (!v) throw new Error('useSavings must be used within a SavingsProvider')
  return v
}
