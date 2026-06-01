'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Board, Outcome, Player, Route, Theme } from '../lib/types'
import { aiMove, applyMove, emptyBoard, outcome } from '../lib/game'

type Tally = { x: number; o: number; draws: number }

type AppApi = {
  board: Board
  current: Player
  result: Outcome
  tally: Tally
  theme: Theme
  route: Route
  aiStarts: boolean
  play: (index: number) => void
  reset: () => void
  resetTally: () => void
  setAiStarts: (value: boolean) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

function addToTally(t: Tally, result: Outcome): Tally {
  if (result === 'X') return { ...t, x: t.x + 1 }
  if (result === 'O') return { ...t, o: t.o + 1 }
  if (result === 'draw') return { ...t, draws: t.draws + 1 }
  return t
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [board, setBoard] = useState<Board>(emptyBoard)
  const [current, setCurrent] = useState<Player>('X')
  const [result, setResult] = useState<Outcome>(null)
  const [tally, setTally] = useState<Tally>({ x: 0, o: 0, draws: 0 })
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('play')
  const [aiStarts, setAiStartsState] = useState(false)

  const value = useMemo<AppApi>(() => {
    const play = (index: number) => {
      if (result !== null) return
      if (board[index] !== null) return
      let next = applyMove(board, index, 'X')
      if (next === board) return
      let out = outcome(next)
      if (out === null) {
        const ai = aiMove(next)
        if (ai !== -1) next = applyMove(next, ai, 'O')
        out = outcome(next)
      }
      setBoard(next)
      setCurrent('X')
      setResult(out)
      if (out !== null) setTally((t) => addToTally(t, out))
    }

    const reset = () => {
      let next = emptyBoard()
      if (aiStarts) {
        const ai = aiMove(next)
        if (ai !== -1) next = applyMove(next, ai, 'O')
      }
      setBoard(next)
      setCurrent('X')
      setResult(null)
    }

    const resetTally = () => setTally({ x: 0, o: 0, draws: 0 })

    const setAiStarts = (v: boolean) => setAiStartsState(v)

    const navigate = (next: Route) => setRoute(next)

    return {
      board,
      current,
      result,
      tally,
      theme,
      route,
      aiStarts,
      play,
      reset,
      resetTally,
      setAiStarts,
      setTheme,
      navigate,
    }
  }, [board, current, result, tally, theme, route, aiStarts])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
