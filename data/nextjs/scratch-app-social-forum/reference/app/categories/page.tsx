'use client'
import { useApp } from '../../components/AppStateProvider'
import { useThreads } from '../../hooks/useThreads'

export default function CategoriesPage() {
  const { categories, threads } = useApp()
  const { stats } = useThreads()

  const countFor = (categoryId: string): number =>
    threads.filter((t) => t.categoryId === categoryId).length

  return (
    <section data-testid="page-categories">
      <h1>Categories</h1>
      <div data-testid="forum-stats">
        <span data-testid="stat-threads">{stats.totalThreads}</span>
        <span data-testid="stat-replies">{stats.totalReplies}</span>
        <span data-testid="stat-votes">{stats.totalVotes}</span>
      </div>
      <ul data-testid="category-list">
        {categories.map((c) => (
          <li key={c.id} data-testid={`category-${c.id}`}>
            <span data-testid={`category-${c.id}-name`}>{c.name}</span>
            <span data-testid={`category-${c.id}-count`}>{countFor(c.id)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
