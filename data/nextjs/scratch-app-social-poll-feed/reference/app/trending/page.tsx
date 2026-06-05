'use client'
import { usePolls } from '../../hooks/usePolls'
import { totalVotes } from '../../lib/polls'

export default function TrendingPage() {
  const { trending, stats } = usePolls()
  return (
    <section data-testid="page-trending">
      <h1>Trending</h1>
      <div data-testid="trend-stats">
        <span data-testid="stat-polls">{stats.totalPolls}</span>
        <span data-testid="stat-votes">{stats.totalVotes}</span>
      </div>
      <ul data-testid="trend-list">
        {trending.map((p) => (
          <li key={p.id} data-testid={`trend-${p.id}`}>
            <span data-testid={`trend-${p.id}-question`}>{p.question}</span>
            <span data-testid={`trend-${p.id}-total`}>{totalVotes(p)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
