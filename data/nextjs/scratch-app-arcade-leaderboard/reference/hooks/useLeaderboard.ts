'use client'
import { useApp } from '../components/AppStateProvider'
import { rankScores, playerCount } from '../lib/leaderboard'

export function useLeaderboard() {
  const { games, scores } = useApp()
  const ranked = rankScores(scores)
  const stats = {
    totalScores: scores.length,
    totalGames: games.length,
    players: playerCount(scores),
  }
  return { ranked, stats }
}
