'use client'
import { useApp } from '../hooks/useApp'
import type { Source } from '../lib/types'

const SOURCES: Source[] = ['Twitter', 'LinkedIn', 'Referral', 'Other']

export function StatsView() {
  const { entries } = useApp()
  const total = entries.length
  const invited = entries.filter((e) => e.status === 'invited').length
  const pending = entries.filter((e) => e.status === 'pending').length
  const rate = total === 0 ? 0 : Math.round((invited / total) * 100)

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Invited: ${invited}`}</p>
      <p>{`Pending: ${pending}`}</p>
      <p>{`Invite rate: ${rate}%`}</p>
      {SOURCES.map((src) => {
        const count = entries.filter((e) => e.source === src).length
        if (count === 0) return null
        return <p key={src}>{`${src}: ${count}`}</p>
      })}
    </section>
  )
}
