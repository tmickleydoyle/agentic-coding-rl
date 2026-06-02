'use client'
import { useGrowth } from '../hooks/useGrowth'
import { BOUNTY_PER_SIGNUP } from '../lib/types'

export function Funnel() {
  const { referrals } = useGrowth()
  const invites = referrals.reduce((s, r) => s + r.invites, 0)
  const signups = referrals.reduce((s, r) => s + r.signups, 0)
  const rate = invites > 0 ? `${Math.round((signups / invites) * 100)}%` : 'n/a'
  const bounty = signups * BOUNTY_PER_SIGNUP
  return (
    <section aria-label="Funnel view">
      <h1>Funnel</h1>
      <p>{`Total invites: ${invites}`}</p>
      <p>{`Total signups: ${signups}`}</p>
      <p>{`Conversion rate: ${rate}`}</p>
      <p>{`Bounty owed: $${bounty}`}</p>
    </section>
  )
}
