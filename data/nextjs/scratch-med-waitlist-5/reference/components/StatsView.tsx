'use client'
import { useApp } from '../hooks/useApp'
import type { Source } from '../lib/types'

const ALL_SOURCES: Source[] = ['twitter', 'linkedin', 'referral', 'other']

export function StatsView() {
  const { entries } = useApp()
  const total = entries.length
  const pending = entries.filter((e) => e.status === 'pending').length
  const invited = entries.filter((e) => e.status === 'invited').length
  const pct = total === 0 ? 0 : Math.round((invited / total) * 100)

  const sourcesWithEntries = ALL_SOURCES.filter(
    (s) => entries.filter((e) => e.source === s).length > 0,
  )

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Pending: ${pending}`}</p>
      <p>{`Invited: ${invited}`}</p>
      <p>{`Invite rate: ${pct}%`}</p>
      <section aria-label="By source">
        <h2>By source</h2>
        <ul>
          {sourcesWithEntries.map((s) => {
            const count = entries.filter((e) => e.source === s).length
            return <li key={s}>{`${s}: ${count}`}</li>
          })}
        </ul>
      </section>
    </section>
  )
}
