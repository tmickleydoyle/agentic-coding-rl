'use client'
import { useApp } from '../../components/AppStateProvider'
import EntryRow from '../../components/EntryRow'

export default function LeaderboardPage() {
  const { entries } = useApp()
  return (
    <section data-testid="page-leaderboard">
      <h1>Leaderboard</h1>
      <span data-testid="entry-count">{entries.length}</span>
      <ul data-testid="entry-list">
        {entries.map((e) => (
          <EntryRow key={e.id} id={e.id} name={e.name} score={e.score} />
        ))}
      </ul>
    </section>
  )
}
