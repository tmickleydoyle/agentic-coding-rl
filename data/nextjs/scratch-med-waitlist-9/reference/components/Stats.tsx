'use client'
import { useApp } from '../hooks/useApp'
import type { Source } from '../lib/types'

const SOURCES: Source[] = ['organic', 'referral', 'social']

export function Stats() {
  const { entries } = useApp()
  const total = entries.length
  const invited = entries.filter((e) => e.status === 'invited').length
  const pending = entries.filter((e) => e.status === 'pending').length
  const pct = total === 0 ? 0 : Math.round((invited / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Invited: ${invited}`}</p>
      <p>{`Pending: ${pending}`}</p>
      <p>{`Invited rate: ${pct}%`}</p>
      {SOURCES.map((s) => {
        const count = entries.filter((e) => e.source === s).length
        return <p key={s}>{`${s}: ${count}`}</p>
      })}
    </section>
  )
}
