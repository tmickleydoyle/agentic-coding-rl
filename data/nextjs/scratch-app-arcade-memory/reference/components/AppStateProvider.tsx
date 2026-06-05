'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Game, Route, Theme } from '../lib/types'
import { bestScore, clearMismatch, flip, isWon, newGame } from '../lib/memory'

const DEFAULT_SYMBOLS = ['A', 'B', 'C', 'D']

type AppApi = {
  game: Game
  best: number | null
  theme: Theme
  route: Route
  symbols: string[]
  pendingMismatch: boolean
  pick: (id: string) => void
  clear: () => void
  reset: () => void
  resetBest: () => void
  setSymbols: (list: string[]) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

function hasPendingMismatch(game: Game): boolean {
  return game.cards.filter((c) => c.faceUp && !c.matched).length >= 2
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [symbols, setSymbolsState] = useState<string[]>(DEFAULT_SYMBOLS)
  const [game, setGame] = useState<Game>(() => newGame(DEFAULT_SYMBOLS))
  const [best, setBest] = useState<number | null>(null)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('play')

  const pendingMismatch = hasPendingMismatch(game)

  const value = useMemo<AppApi>(() => {
    const clear = () => setGame((g) => clearMismatch(g))

    const pick = (id: string) => {
      setGame((g) => {
        const next = flip(g, id)
        if (next === g) return g
        if (hasPendingMismatch(next)) {
          setTimeout(() => clear(), 800)
        } else if (isWon(next)) {
          setBest((b) => bestScore(b, next.moves))
        }
        return next
      })
    }

    const reset = () => setGame(newGame(symbols))

    const resetBest = () => setBest(null)

    const setSymbols = (list: string[]) => {
      setSymbolsState(list)
      setGame(newGame(list))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      game,
      best,
      theme,
      route,
      symbols,
      pendingMismatch,
      pick,
      clear,
      reset,
      resetBest,
      setSymbols,
      setTheme,
      navigate,
    }
  }, [game, best, theme, route, symbols, pendingMismatch])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
