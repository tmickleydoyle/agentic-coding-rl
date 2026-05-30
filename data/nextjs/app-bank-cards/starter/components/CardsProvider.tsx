'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Card, Charge, Route, Theme } from '../lib/types'

type NewChargeInput = { cardId: string; merchant?: string; amount: number }
type ChargeResult = { ok: true } | { ok: false; error: string }

type CardsApi = {
  cards: Card[]
  charges: Charge[]
  theme: Theme
  route: Route
  selectedId: string | null
  addCharge: (input: NewChargeInput) => ChargeResult
  toggleFreeze: (id: string) => void
  setLimit: (id: string, limit: number) => void
  select: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const CardsContext = createContext<CardsApi | null>(null)

const STUB: CardsApi = {
  cards: [],
  charges: [],
  theme: 'light',
  route: 'cards',
  selectedId: null,
  addCharge: () => ({ ok: false, error: 'not implemented' }),
  toggleFreeze: () => {},
  setLimit: () => {},
  select: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function CardsProvider({ children }: { children: ReactNode }) {
  // TODO: hold cards/charges/theme/route/selectedId in state (seed 3 cards + 5 charges),
  // implement addCharge (validate frozen/positive/over-limit), toggleFreeze, setLimit,
  // select, and navigation. The STUB below mounts the app but does nothing — replace it.
  return <CardsContext.Provider value={STUB}>{children}</CardsContext.Provider>
}

export function useCards(): CardsApi {
  const v = useContext(CardsContext)
  if (!v) throw new Error('useCards must be used within a CardsProvider')
  return v
}
