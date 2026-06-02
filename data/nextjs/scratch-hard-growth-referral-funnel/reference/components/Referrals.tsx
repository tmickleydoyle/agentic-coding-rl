'use client'
import { useState } from 'react'
import { useGrowth } from '../hooks/useGrowth'
import { SOURCES } from '../lib/types'

export function Referrals() {
  const { referrals, addReferral, convertedOnly } = useGrowth()
  const [referrer, setReferrer] = useState('')
  const [source, setSource] = useState('Organic')
  const [invites, setInvites] = useState('')
  const [signups, setSignups] = useState('')

  const visible = referrals.filter((r) => !convertedOnly || r.signups > 0)

  return (
    <section aria-label="Referrals view">
      <h1>Referrals</h1>
      <input aria-label="Referrer" value={referrer} onChange={(e) => setReferrer(e.target.value)} />
      <select aria-label="Source" value={source} onChange={(e) => setSource(e.target.value)}>
        {SOURCES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <input aria-label="Invites" type="number" value={invites} onChange={(e) => setInvites(e.target.value)} />
      <input aria-label="Signups" type="number" value={signups} onChange={(e) => setSignups(e.target.value)} />
      <button
        onClick={() => {
          addReferral(referrer, source, invites, signups)
          setReferrer('')
          setInvites('')
          setSignups('')
        }}
      >
        Add referral
      </button>
      <ul>
        {visible.map((r) => (
          <li key={r.id}>
            {`${r.referrer} — ${r.source}: ${r.invites} invites, ${r.signups} signups`}
          </li>
        ))}
      </ul>
    </section>
  )
}
