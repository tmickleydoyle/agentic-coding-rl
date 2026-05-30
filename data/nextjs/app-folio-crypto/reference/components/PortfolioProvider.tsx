'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Coin, Route, Theme } from '../lib/types'

type NewCoinInput = {
  symbol: string
  name: string
  amount: number
  price: number
  change24h: number
}

type PortfolioApi = {
  coins: Coin[]
  theme: Theme
  route: Route
  selectedCoinId: string | null
  addCoin: (input: NewCoinInput) => void
  removeCoin: (id: string) => void
  selectCoin: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const PortfolioContext = createContext<PortfolioApi | null>(null)

const SEED_COINS: Coin[] = [
  { id: 'c1', symbol: 'BTC', name: 'Bitcoin', amount: 0.5, price: 60000, change24h: 5 },
  { id: 'c2', symbol: 'ETH', name: 'Ethereum', amount: 4, price: 3000, change24h: -2 },
  { id: 'c3', symbol: 'SOL', name: 'Solana', amount: 50, price: 100, change24h: 10 },
]

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState<Coin[]>(SEED_COINS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('portfolio')
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<PortfolioApi>(() => {
    const addCoin = (input: NewCoinInput) => {
      const id = `c${nextId}`
      setNextId((n) => n + 1)
      setCoins((prev) => [
        ...prev,
        {
          id,
          symbol: input.symbol,
          name: input.name,
          amount: input.amount,
          price: input.price,
          change24h: input.change24h,
        },
      ])
    }

    const removeCoin = (id: string) => {
      setCoins((prev) => prev.filter((c) => c.id !== id))
      setSelectedCoinId((cur) => (cur === id ? null : cur))
    }

    const selectCoin = (id: string) => {
      setSelectedCoinId(id)
      setRoute('coin-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      coins,
      theme,
      route,
      selectedCoinId,
      addCoin,
      removeCoin,
      selectCoin,
      setTheme,
      navigate,
    }
  }, [coins, theme, route, selectedCoinId, nextId])

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio(): PortfolioApi {
  const v = useContext(PortfolioContext)
  if (!v) throw new Error('usePortfolio must be used within a PortfolioProvider')
  return v
}
