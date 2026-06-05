'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import { rankScores, scoresForGame } from '../../lib/leaderboard'

export default function RankingsPage() {
  const { games, scores } = useApp()
  const { stats } = useLeaderboard()
  const [filter, setFilter] = useState('all')

  const list = filter === 'all' ? rankScores(scores) : scoresForGame(scores, filter)

  return (
    <section data-testid="page-rankings">
      <h1>Rankings</h1>
      <select
        data-testid="filter-select"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All</option>
        {games.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
      <div data-testid="rank-stats">
        <span data-testid="stat-scores">{stats.totalScores}</span>
        <span data-testid="stat-players">{stats.players}</span>
      </div>
      <ul data-testid="rank-list">
        {list.map((s) => (
          <li key={s.id} data-testid={`rank-${s.id}`}>
            <span data-testid={`rank-${s.id}-player`}>{s.player}</span>
            <span data-testid={`rank-${s.id}-points`}>{s.points}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
