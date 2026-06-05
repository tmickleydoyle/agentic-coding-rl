'use client'
import { useApp } from '../hooks/useApp'

export function StatsView() {
  const { entries } = useApp()
  const total = entries.length
  const invited = entries.filter((e) => e.status === 'invited').length
  const pending = entries.filter((e) => e.status === 'pending').length
  const pct = total === 0 ? 0 : Math.round((invited / total) * 100)
  const organic = entries.filter((e) => e.source === 'organic').length
  const referral = entries.filter((e) => e.source === 'referral').length
  const social = entries.filter((e) => e.source === 'social').length
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total signups: ${total}`}</p>
      <p>{`Invited: ${invited}`}</p>
      <p>{`Pending: ${pending}`}</p>
      <p>{`Invite rate: ${pct}%`}</p>
      <h2>By source</h2>
      <p>{`organic: ${organic}`}</p>
      <p>{`referral: ${referral}`}</p>
      <p>{`social: ${social}`}</p>
    </section>
  )
}
