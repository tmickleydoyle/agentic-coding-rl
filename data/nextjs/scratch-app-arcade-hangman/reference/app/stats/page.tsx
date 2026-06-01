'use client'
import { useApp } from '../../components/AppStateProvider'

export default function StatsPage() {
  const { stats, clearStats } = useApp()
  const played = stats.wins + stats.losses
  const winRate = played === 0 ? 0 : Math.round((stats.wins / played) * 100)
  return (
    <section data-testid="page-stats">
      <h1>Stats</h1>
      <span data-testid="wins">{stats.wins}</span>
      <span data-testid="losses">{stats.losses}</span>
      <span data-testid="played">{played}</span>
      <span data-testid="win-rate">{winRate}</span>
      <button data-testid="clear-stats" onClick={clearStats}>
        Clear stats
      </button>
    </section>
  )
}
