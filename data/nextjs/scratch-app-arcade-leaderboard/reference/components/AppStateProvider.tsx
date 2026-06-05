'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Game, Score, Route, Theme } from '../lib/types'

type AppApi = {
  games: Game[]
  scores: Score[]
  theme: Theme
  route: Route
  selectedGameId: string | null
  submitScore: (gameId: string, player: string, points: number) => string | null
  openGame: (gameId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

function seedGames(): Game[] {
  return [
    { id: 'g1', name: 'Asteroids' },
    { id: 'g2', name: 'Pac-Man' },
    { id: 'g3', name: 'Tetris' },
  ]
}

function seedScores(): Score[] {
  return [
    { id: 's1', gameId: 'g1', player: 'Ada', points: 1200 },
    { id: 's2', gameId: 'g1', player: 'Bo', points: 900 },
    { id: 's3', gameId: 'g1', player: 'Cy', points: 1500 },
    { id: 's4', gameId: 'g2', player: 'Ada', points: 300 },
    { id: 's5', gameId: 'g2', player: 'Di', points: 500 },
    { id: 's6', gameId: 'g3', player: 'Bo', points: 700 },
  ]
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [games] = useState<Game[]>(seedGames)
  const [scores, setScores] = useState<Score[]>(seedScores)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('games')
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [nextScoreId, setNextScoreId] = useState(7)

  const value = useMemo<AppApi>(() => {
    const submitScore = (gameId: string, player: string, points: number): string | null => {
      if (!games.some((g) => g.id === gameId)) return null
      const name = player.trim()
      if (name.length === 0) return null
      if (!Number.isFinite(points) || points < 0) return null
      const id = `s${nextScoreId}`
      setNextScoreId((n) => n + 1)
      setScores((prev) => [...prev, { id, gameId, player: name, points }])
      return id
    }

    const openGame = (gameId: string) => {
      setSelectedGameId(gameId)
      setRoute('game-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      games,
      scores,
      theme,
      route,
      selectedGameId,
      submitScore,
      openGame,
      setTheme,
      navigate,
    }
  }, [games, scores, theme, route, selectedGameId, nextScoreId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
