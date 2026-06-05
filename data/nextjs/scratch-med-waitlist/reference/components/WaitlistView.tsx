'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Source } from '../lib/types'

type Filter = 'all' | 'pending' | 'invited'

export function WaitlistView() {
  const { entries, addEntry, invite } = useApp()
  const [email, setEmail] = useState('')
  const [source, setSource] = useState<Source>('organic')
  const [filter, setFilter] = useState<Filter>('all')

  const displayed =
    filter === 'all' ? entries : entries.filter((e) => e.status === filter)

  return (
    <section aria-label="Waitlist view">
      <h1>Waitlist Manager</h1>
      <div>
        <input
          aria-label="Email"
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <select
          aria-label="Source"
          value={source}
          onChange={(ev) => setSource(ev.target.value as Source)}
        >
          <option value="organic">organic</option>
          <option value="referral">referral</option>
          <option value="social">social</option>
        </select>
        <button
          onClick={() => {
            addEntry(email, source)
            setEmail('')
          }}
        >
          Add to waitlist
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by status"
          value={filter}
          onChange={(ev) => setFilter(ev.target.value as Filter)}
        >
          <option value="all">all</option>
          <option value="pending">pending</option>
          <option value="invited">invited</option>
        </select>
      </div>
      <h2>{`Waitlist (${displayed.length})`}</h2>
      <ul>
        {displayed.map((entry) => (
          <li key={entry.id}>
            <span>{entry.email}</span>
            <span>{entry.source}</span>
            <span>{entry.status}</span>
            {entry.status === 'pending' && (
              <button onClick={() => invite(entry.id)}>Invite</button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
