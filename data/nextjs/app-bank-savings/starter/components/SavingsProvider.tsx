'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

export function SavingsProvider({ children }: { children: ReactNode }) {
  // TODO: real state — seed 3 pots + unallocated pool; implement allocate/withdraw (with
  // validation), createPot, select, setTheme/setCurrency, navigate.
  const value: SavingsApi = {
    pots: [],
    unallocated: 0,
    theme: 'light',
    currency: 'USD',
    route: 'pots',
    selectedId: null,
    allocate: () => ({ ok: false, error: 'not implemented' }),
    withdraw: () => ({ ok: false, error: 'not implemented' }),
    createPot: () => {},
    select: () => {},
    setTheme: () => {},
    setCurrency: () => {},
    navigate: () => {},
  }
  return <SavingsContext.Provider value={value}>{children}</SavingsContext.Provider>
}

export function useSavings(): SavingsApi {
  const v = useContext(SavingsContext)
  if (!v) throw new Error('useSavings must be used within a SavingsProvider')
  return v
}
