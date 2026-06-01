'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { HangmanState, Route, Theme } from '../lib/types'
import { guess, isOver, newState } from '../lib/hangman'

const WORDS = ['cat', 'react', 'puzzle', 'banana']

type Stats = { wins: number; losses: number }

type AppApi = {
  game: HangmanState
  words: string[]
  wordIndex: number
  stats: Stats
  theme: Theme
  route: Route
  play: (letter: string) => void
  next: () => void
  reset: () => void
  pick: (index: number) => void
  clearStats: () => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [words] = useState<string[]>(WORDS)
  const [wordIndex, setWordIndex] = useState(0)
  const [game, setGame] = useState<HangmanState>(() => newState(WORDS[0]))
  const [stats, setStats] = useState<Stats>({ wins: 0, losses: 0 })
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('play')

  const value = useMemo<AppApi>(() => {
    const play = (letter: string) => {
      setGame((g) => {
        const next = guess(g, letter)
        if (next === g) return g
        if (next.status === 'won' && g.status === 'playing') {
          setStats((s) => ({ ...s, wins: s.wins + 1 }))
        } else if (next.status === 'lost' && g.status === 'playing') {
          setStats((s) => ({ ...s, losses: s.losses + 1 }))
        }
        return next
      })
    }

    const next = () => {
      const ni = (wordIndex + 1) % words.length
      setWordIndex(ni)
      setGame(newState(words[ni]))
    }

    const reset = () => setGame(newState(words[wordIndex]))

    const pick = (index: number) => {
      if (index < 0 || index >= words.length) return
      setWordIndex(index)
      setGame(newState(words[index]))
    }

    const clearStats = () => setStats({ wins: 0, losses: 0 })

    const navigate = (r: Route) => setRoute(r)

    return {
      game,
      words,
      wordIndex,
      stats,
      theme,
      route,
      play,
      next,
      reset,
      pick,
      clearStats,
      setTheme,
      navigate,
    }
  }, [game, words, wordIndex, stats, theme, route])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
