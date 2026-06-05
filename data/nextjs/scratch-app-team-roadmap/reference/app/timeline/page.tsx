'use client'
import { useApp } from '../../components/AppStateProvider'
import { useRoadmap } from '../../hooks/useRoadmap'
import { QUARTER_ORDER } from '../../lib/types'
import type { Initiative } from '../../lib/types'

export default function TimelinePage() {
  const { initiatives } = useApp()
  const { statusTotals } = useRoadmap()

  const ordered: Initiative[] = []
  QUARTER_ORDER.forEach((qid) => {
    initiatives.filter((i) => i.quarterId === qid).forEach((i) => ordered.push(i))
  })

  return (
    <section data-testid="page-timeline">
      <h1>Timeline</h1>
      <span data-testid="timeline-planned-count">{statusTotals.planned}</span>
      <span data-testid="timeline-in-progress-count">{statusTotals['in-progress']}</span>
      <span data-testid="timeline-done-count">{statusTotals.done}</span>
      <ul data-testid="timeline-list">
        {ordered.map((i) => (
          <li key={i.id} data-testid={`timeline-${i.id}`}>
            {i.title}
          </li>
        ))}
      </ul>
    </section>
  )
}
