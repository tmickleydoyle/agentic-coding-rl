'use client'
import { useGrowth } from '../hooks/useGrowth'
import { SOURCES } from '../lib/types'

export function Sources() {
  const { referrals } = useGrowth()

  const rows = SOURCES.map((src) => {
    const inSrc = referrals.filter((r) => r.source === src)
    const invites = inSrc.reduce((s, r) => s + r.invites, 0)
    const signups = inSrc.reduce((s, r) => s + r.signups, 0)
    return { src, count: inSrc.length, invites, signups }
  }).filter((r) => r.count > 0)

  return (
    <section aria-label="Sources view">
      <h1>Sources</h1>
      {rows.length === 0 && <p>No source data yet</p>}
      {rows.map((r) => {
        const rate = r.invites > 0 ? `${Math.round((r.signups / r.invites) * 100)}%` : 'n/a'
        return (
          <div key={r.src}>
            <span>{`${r.src}: ${r.invites} invites, ${r.signups} signups, rate ${rate}`}</span>
          </div>
        )
      })}
    </section>
  )
}
