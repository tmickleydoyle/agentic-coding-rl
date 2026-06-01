'use client'
import { useApp } from '../../components/AppStateProvider'

function rate(conversions: number, sessions: number): number {
  if (sessions === 0) return 0
  return Math.round((conversions / sessions) * 100)
}

export default function SourcesPage() {
  const { sources } = useApp()
  return (
    <section data-testid="page-sources">
      <h1>Sources</h1>
      <ul data-testid="source-list">
        {sources.map((s) => (
          <li key={s.id} data-testid={`source-${s.id}`}>
            <span data-testid={`source-${s.id}-name`}>{s.name}</span>
            <span data-testid={`source-${s.id}-sessions`}>{s.sessions}</span>
            <span data-testid={`source-${s.id}-rate`}>{rate(s.conversions, s.sessions)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
