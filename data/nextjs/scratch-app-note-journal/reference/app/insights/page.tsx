'use client'
import { useJournal } from '../../hooks/useJournal'

export default function InsightsPage() {
  const { counts, topMood } = useJournal()
  return (
    <section data-testid="page-insights">
      <h1>Insights</h1>
      <p data-testid="count-happy">{counts.happy}</p>
      <p data-testid="count-neutral">{counts.neutral}</p>
      <p data-testid="count-sad">{counts.sad}</p>
      <p data-testid="count-total">{counts.total}</p>
      <p data-testid="top-mood">{topMood ?? 'none'}</p>
    </section>
  )
}
