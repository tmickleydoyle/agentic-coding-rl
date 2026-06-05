'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_CARDS: Card[] = [
  { id: 'k1', label: 'Personal Visa', last4: '4242', frozen: false, limit: 1000 },
  { id: 'k2', label: 'Travel Mastercard', last4: '1881', frozen: false, limit: 2000 },
  { id: 'k3', label: 'Backup Card', last4: '0007', frozen: true, limit: 500 },
]

const SEED_CHARGES: Charge[] = [
  { id: 'h1', cardId: 'k1', merchant: 'Coffee Co', amount: 6 },
  { id: 'h2', cardId: 'k1', merchant: 'Bookshop', amount: 54 },
  { id: 'h3', cardId: 'k2', merchant: 'Grand Inn', amount: 320 },
  { id: 'h4', cardId: 'k2', merchant: 'SkyAir', amount: 480 },
  { id: 'h5', cardId: 'k1', merchant: 'Bistro', amount: 40 },
]

export function CardsProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<Card[]>(SEED_CARDS)
  const [charges, setCharges] = useState<Charge[]>(SEED_CHARGES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('cards')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextChargeId, setNextChargeId] = useState(6)

  const value = useMemo<CardsApi>(() => {
    const addCharge = (input: NewChargeInput): ChargeResult => {
      const card = cards.find((c) => c.id === input.cardId)
      if (!card) return { ok: false, error: 'unknown card' }
      if (card.frozen) return { ok: false, error: 'card frozen' }
      if (!(input.amount > 0)) return { ok: false, error: 'amount must be positive' }
      let spent = 0
      charges.forEach((c) => {
        if (c.cardId === input.cardId) spent += c.amount
      })
      if (spent + input.amount > card.limit) return { ok: false, error: 'over limit' }

      const id = `h${nextChargeId}`
      setNextChargeId((n) => n + 1)
      setCharges((prev) => [
        ...prev,
        {
          id,
          cardId: input.cardId,
          merchant: input.merchant ?? '',
          amount: input.amount,
        },
      ])
      return { ok: true }
    }

    const toggleFreeze = (id: string) => {
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, frozen: !c.frozen } : c)))
    }

    const setLimit = (id: string, limit: number) => {
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, limit } : c)))
    }

    const select = (id: string) => {
      setSelectedId(id)
      setRoute('card-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      cards,
      charges,
      theme,
      route,
      selectedId,
      addCharge,
      toggleFreeze,
      setLimit,
      select,
      setTheme,
      navigate,
    }
  }, [cards, charges, theme, route, selectedId, nextChargeId])

  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>
}

export function useCards(): CardsApi {
  const v = useContext(CardsContext)
  if (!v) throw new Error('useCards must be used within a CardsProvider')
  return v
}
